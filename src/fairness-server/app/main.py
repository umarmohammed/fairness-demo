from flask import Flask, request, jsonify
from flask_cors import CORS
from joblib import load
import numpy as np
import json
from sklearn import metrics

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

fair_metrics = {"Cohen-D": CohenD,
                "2-SD Rule": TwoSDRule,
                "StatParity": StatParity,
                "EqualOppDiff": EqualOppDiff,
                "DispImpact": DispImpact,
                "AvgOddsDiff": AvgOddsDiff
                }


def computeMetrics(y, gmin, gmaj, ypred_prob):

    def computeMetricsForThreshold(threshold):
        ypred_class = (ypred_prob >= threshold) * 1.0
        metrics = []
        fairness_metrics = []
        for pf in perf_metrics.keys():
            if pf in ["AUC", "Brier"]:
                metrics += [{"name": pf, "value": perf_metrics[pf]
                             (y.values.ravel(), ypred_prob)}]
            else:
                metrics += [{"name": pf, "value": perf_metrics[pf]
                             (y.values.ravel(), ypred_class)}]

        for ff in fair_metrics.keys():
            fairness_metrics += [{"name": ff, "value": fair_metrics[ff]
                                  (y.values.ravel(), ypred_class, gmaj, gmin)}]

        return {"threshold": threshold, "performance": metrics, "fairness": fairness_metrics}

    return list(map(computeMetricsForThreshold, [i/100 for i in list(range(0, 105, 5))]))


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
    return (y, gmin, gmaj, ypred_prob)


@app.route("/api/metrics", methods=["POST"])
def getMetrics():
    file = request.files['file']

    stuff = getStuffNeededForMetrics(
        load(file.stream), json.loads(request.form['data']))
    metrics = computeMetrics(*stuff)
    return jsonify(metrics)
