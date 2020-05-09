from flask import Flask, request, jsonify
from flask_cors import CORS
from joblib import load
import numpy as np
import json
from sklearn import metrics
from functools import reduce

app = Flask(__name__)
CORS(app)


def CohenD(yobs, ypred, gmaj, gmin):
    # Cohen-D
    SR_min = ypred[gmin == 1].mean()  # success rate minority
    SR_maj = ypred[gmaj == 1].mean()  # success rate majority

    STD_maj = np.sqrt(SR_maj * (1.0 - SR_maj))
    STD_min = np.sqrt(SR_min * (1.0 - SR_min))
    POOL_STD = STD_maj * (sum(gmaj == 1)/(sum(gmin == 1) + sum(gmaj == 1))) + \
        STD_min * (sum(gmin == 1)/(sum(gmin == 1) + sum(gmaj == 1)))

    return 0 if POOL_STD == 0 else StatParity(yobs, ypred, gmaj, gmin)/POOL_STD


def DispImpact(yobs, ypred, gmaj, gmin):
    # Disparate Impact (a.k.a. Adverse Impact Ratio)
    SR_min = ypred[gmin == 1].mean()  # success rate minority
    SR_maj = ypred[gmaj == 1].mean()  # success rate majority
    return SR_min/SR_maj


def StatParity(yobs, ypred, gmaj, gmin):
    # Statistical Parity Difference
    SR_min = ypred[gmin == 1].mean()  # success rate minority
    SR_maj = ypred[gmaj == 1].mean()  # success rate majority
    return SR_min - SR_maj


def TwoSDRule(yobs, ypred, gmaj, gmin):
    # 2-SD Rule
    SR_min = ypred[gmin == 1].mean()  # success rate minority
    SR_maj = ypred[gmaj == 1].mean()  # success rate majority
    SR_T = ypred.mean()  # success rate total
    P_min = (gmin == 1).mean()  # minority proportion
    N = len(ypred)
    return 0 if (1 - SR_T) == 0 else (SR_min - SR_maj)/np.sqrt((SR_T * (1.0 - SR_T))/(N * P_min * (1 - P_min)))


def EqualOppDiff(yobs, ypred, gmaj, gmin):
    # Equal Opportunity Difference
    TPR_maj = sum((yobs[gmaj == 1] == 1) *
                  (ypred[gmaj == 1] == 1))/sum(yobs[gmaj == 1] == 1)
    TPR_min = sum((yobs[gmin == 1] == 1) *
                  (ypred[gmin == 1] == 1))/sum(yobs[gmin == 1] == 1)
    return TPR_min - TPR_maj


def AvgOddsDiff(yobs, ypred, gmaj, gmin):
    # Average Odds Difference
    return (EqualOppDiff(yobs == 0, ypred == 0, gmaj, gmin) + EqualOppDiff(yobs, ypred, gmaj, gmin))/2.0


perf_metrics = {"Accuracy": metrics.accuracy_score,
                "Precision": metrics.precision_score,
                "Recall": metrics.recall_score,
                "AUC": metrics.roc_auc_score,
                "F1-Score": metrics.f1_score,
                "Brier": metrics.brier_score_loss}

fair_metrics = {"Cohen-D": (CohenD, [0]),
                "2-SD Rule": (TwoSDRule, [2, 0, -2]),
                "StatParity": (StatParity, [0.1, 0, -0.1]),
                "EqualOppDiff": (EqualOppDiff, [0.1, 0, -0.1]),
                "DispImpact": (DispImpact, [1.2, 1, 0.8]),
                "AvgOddsDiff": (AvgOddsDiff, [0.1, 0, -0.1])
                }


def computeMetrics(y, gmin, gmaj, ypred_prob, selectedFeatures):

    def computeMetricsForThreshold(threshold):
        ypred_class = (ypred_prob >= threshold) * 1.0

        def computePerformanceMetrics_(perf_name):

            def computePerformanceMetric(filter_name):
                def getSelectedFeatureName():
                    return selectedFeatures[filter_name] if filter_name in selectedFeatures else filter_name

                def getPerformanceParams():
                    def getFilter():
                        if (filter_name == 'gmin'):
                            return gmin == 1
                        if (filter_name == 'gmaj'):
                            return gmaj == 1
                        return None

                    if filter_name is 'all':
                        return (getSelectedFeatureName(), y.values.ravel(), ypred_prob, ypred_class)
                    return (getSelectedFeatureName(), y.values.ravel()[getFilter()], ypred_prob[getFilter()], ypred_class[getFilter()])

                (feature_name, y_values_filtered, ypred_prob_filtered,
                 ypred_class_filtered) = getPerformanceParams()
                if perf_name in ["AUC", "Brier"]:
                    return {"name": feature_name, "value": perf_metrics[perf_name]
                            (y_values_filtered, ypred_prob_filtered)}
                else:
                    return {"name": feature_name, "value": perf_metrics[perf_name]
                            (y_values_filtered, ypred_class_filtered)}

            return {perf_name: [computePerformanceMetric(filter_name) for filter_name in ['all', 'gmin', 'gmaj']]}

        def computeAllPerformanceMetrics():
            return reduce((lambda x, y: {**x, **y}), [computePerformanceMetrics_(
                perf_name) for perf_name in perf_metrics.keys()])

        fairness_metrics = []
        for ff in fair_metrics.keys():
            fairness_metrics += [{"name": ff, "value": fair_metrics[ff][0]
                                  (y.values.ravel(), ypred_class, gmaj, gmin), "thresholds": fair_metrics[ff][1]}]

        return {"threshold": threshold, "performance": computeAllPerformanceMetrics(), "fairness": fairness_metrics}

    return list(map(computeMetricsForThreshold, [i/100 for i in list(range(0, 102, 2))]))


@app.route("/api/features", methods=["POST"])
def features():
    file = request.files['file']
    X = load(file.stream)["X"]
    return jsonify(X.columns.tolist())


def getStuffNeededForMetrics(modelAndData, selectedFeatures):
    X = modelAndData["X"]
    y = modelAndData["y"]
    gmin = X[selectedFeatures["gmin"]].values
    gmaj = X[selectedFeatures["gmaj"]].values
    model = modelAndData["model"]
    ypred_prob = model.predict_proba(X).ravel()[1::2]
    return (y, gmin, gmaj, ypred_prob, selectedFeatures)


@app.route("/api/metrics", methods=["POST"])
def getMetrics():
    file = request.files['file']

    stuff = getStuffNeededForMetrics(
        load(file.stream), json.loads(request.form['data']))
    metrics = computeMetrics(*stuff)
    return jsonify(metrics)


@app.route("/api/fix", methods=["POST"])
def getFix():
    file = request.files['file']

    stuff = getStuffNeededForMetrics(
        load(file.stream), json.loads(request.form['data']))

    return jsonify(stuff[-1])
