from flask import Flask, request, jsonify
from flask_cors import CORS
from joblib import load
import numpy as np
import json
from sklearn import metrics
from functools import reduce
from scipy.optimize import differential_evolution
from types import MethodType

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
    return 0 if SR_maj == 0 else SR_min/SR_maj


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
    return 0 if np.sqrt((SR_T * (1.0 - SR_T))/(N * P_min * (1 - P_min))) == 0 else (SR_min - SR_maj)/np.sqrt((SR_T * (1.0 - SR_T))/(N * P_min * (1 - P_min)))


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

        def computeRatesForGroup(group):
            def getG():
                return gmaj if group == 'Priveleged' else gmin

            def computeGroupFrequency():
                g = getG()
                return sum(g)/(sum(g) + sum(g == 0)) * 100.0

            def computeGroupAR():
                g = getG()
                return sum(ypred_class[g == 1])/sum(g) * 100.0

            series = [{'name': 'Frequency %', 'value': computeGroupFrequency()},
                      {'name': 'Acceptance Rate %', 'value': computeGroupAR()}]

            return {'name': group, 'series': series}

        df_plot = [computeRatesForGroup(group)
                   for group in ['Priveleged', 'Unpriveleged']]

        return {
            "threshold": threshold,
            "performance": computeAllPerformanceMetrics(),
            "fairness": fairness_metrics,
            "dfPlot": df_plot
        }

    return list(map(computeMetricsForThreshold, [i/100 for i in list(range(0, 102, 2))]))


def computeFairMetrics(y, gmin, gmaj, ypred_prob, ypred_class, selectedFeatures):

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

    def computeRatesForGroup(group):
        def getG():
            return gmaj if group == 'Priveleged' else gmin

        def computeGroupFrequency():
            g = getG()
            return sum(g)/(sum(g) + sum(g == 0)) * 100.0

        def computeGroupAR():
            g = getG()
            return sum(ypred_class[g == 1])/sum(g) * 100.0

        series = [{'name': 'Frequency %', 'value': computeGroupFrequency()},
                  {'name': 'Acceptance Rate %', 'value': computeGroupAR()}]

        return {'name': group, 'series': series}

    df_plot = [computeRatesForGroup(group)
               for group in ['Priveleged', 'Unpriveleged']]

    fairness_metrics = []
    for ff in fair_metrics.keys():
        fairness_metrics += [{"name": ff, "value": fair_metrics[ff][0]
                              (y.values.ravel(), ypred_class, gmaj, gmin), "thresholds": fair_metrics[ff][1]}]

    return {"performance": computeAllPerformanceMetrics(), "fairness": fairness_metrics, "dfPlot": df_plot}


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


def fixModel(y, gmin, gmaj, ypred_prob, rf):
    opt_fair_metric = TwoSDRule  # fairness metric
    goal = 0.000  # best possible value

    def fair_opt(x, f=opt_fair_metric, best_f=goal, g_maj=gmaj, g_min=gmin, obs_values=y, model_pred=ypred_prob):
        # params
        a = 0.0  # x[0]
        b = 1.0  # x[1]
        thresh = x[2]

        # model and predictions
        logit_model_pred = np.log(np.clip(
            ypred_prob, 0.0000001, 0.9999999) / (1.0 - np.clip(ypred_prob, 0.0000001, 0.9999999)))
        new_ypred_prob = 1.0 / \
            (1.0 + np.exp(-(a + b * logit_model_pred)))  # new probabilities
        new_ypred_class = (new_ypred_prob >= thresh) * 1.0

        # cost function
        return np.abs(opt_fair_metric(y.values.ravel(), new_ypred_class, g_maj, g_min) - best_f)

    def fair_predict_proba(self, X):
        old_ypred_prob = self.predict_proba(X)
        logit_model_pred = np.log(np.clip(old_ypred_prob, 0.0000001, 0.9999999) /
                                  (1.0 - np.clip(old_ypred_prob, 0.0000001, 0.9999999)))
        # new probabilities
        return 1.0 / (1.0 + np.exp(-(self.fair_a + self.fair_b * logit_model_pred)))

    def fair_predict(self, X):
        ypred_prob = self.fair_predict_proba(X).ravel()[1::2]
        return (ypred_prob >= self.fair_thresh) * 1.0

    res = differential_evolution(
        fair_opt, [(-0.50, 0.50), (-1.0, 1.0), (0.05, 0.95)])

    rf.fair_a = 0.0  # res.x[0] # 0.0
    rf.fair_b = 1.0  # res.x[1] # 1.0
    rf.fair_thresh = res.x[2]
    rf.fair_predict_proba = MethodType(fair_predict_proba, rf)
    rf.fair_predict = MethodType(fair_predict, rf)

    return rf


def getStuffNeededForFix(modelAndData, selectedFeatures):
    X = modelAndData["X"]
    y = modelAndData["y"]
    gmin = X[selectedFeatures["gmin"]].values
    gmaj = X[selectedFeatures["gmaj"]].values
    model = modelAndData["model"]
    ypred_prob = model.predict_proba(X).ravel()[1::2]

    fixModel(y, gmin, gmaj, ypred_prob, model)
    ypred_prob = model.fair_predict_proba(X).ravel()[1::2]
    ypred_class = model.fair_predict(X).ravel()

    return (y, gmin, gmaj, ypred_prob, ypred_class, selectedFeatures)


@app.route("/api/fix", methods=["POST"])
def getFix():
    file = request.files['file']

    stuff = getStuffNeededForFix(
        load(file.stream), json.loads(request.form['data']))

    return jsonify(computeFairMetrics(*stuff))
