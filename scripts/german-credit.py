
from sklearn.ensemble import RandomForestClassifier
from sklearn import metrics
from sklearn.preprocessing import KBinsDiscretizer
from sklearn.preprocessing import OneHotEncoder
import pandas as pd
import numpy as np

# Fairness metrics


def CohenD(yobs, ypred, gmaj, gmin):
    # Cohen-D
    SR_min = ypred[gmin == 1].mean()  # success rate minority
    SR_maj = ypred[gmaj == 1].mean()  # success rate majority

    STD_maj = np.sqrt(SR_maj * (1.0 - SR_maj))
    STD_min = np.sqrt(SR_min * (1.0 - SR_min))
    POOL_STD = STD_maj * (sum(gmaj == 1)/(sum(gmin == 1) + sum(gmaj == 1))) + \
        STD_min * (sum(gmin == 1)/(sum(gmin == 1) + sum(gmaj == 1)))

    return StatParity(yobs, ypred, gmaj, gmin)/POOL_STD


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
    return (SR_min - SR_maj)/np.sqrt((SR_T * (1.0 - SR_T))/(N * P_min * (1 - P_min)))


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

# Task definition


# get dataset
df = pd.read_csv(
    "../data/raw/german_credit.csv")
sex_ps = df["personal_status_sex"].str.split(":", n=1, expand=True)
sex_ps.columns = ["gender", "personal_status"]
df.drop("personal_status_sex", axis=1, inplace=True)
df = pd.concat([df, sex_ps], axis=1)

# categorical variables
cat_variables = ['account_check_status', 'credit_history', 'purpose', 'savings', 'present_emp_since', 'gender', 'personal_status',
                 'property', 'other_installment_plans', 'housing', 'job', 'telephone', "other_debtors", 'foreign_worker']

# other integer variables
int_variables = ['credits_this_bank', 'present_res_since', 'duration_in_month', 'people_under_maintenance',
                 'installment_as_income_perc', 'age', 'credit_amount']

# target variable
output_variable = ["default"]

# Pre-processing
# Mapping categorical variables to one-hot encoding
df_cat = pd.DataFrame(index=df.index)

# one-hot encoding of categorical variables

# I will do a loop for pedagogical reasons, but it is not entirely necessary
for cat in cat_variables:
    # one-hot encoding fitting
    one_hot_func = OneHotEncoder().fit(df[[cat]])

    # mapping
    cat_mapped = one_hot_func.transform(df[[cat]]).toarray()

    # storing
    for (k, cat_label) in enumerate(one_hot_func.categories_[0]):
        df_cat[cat + "_" + cat_label] = cat_mapped[:, k]

# bracketing integer variable - age
kbin_func = KBinsDiscretizer(
    n_bins=3, encode='onehot', strategy='quantile').fit(df[["age"]])
df_age = pd.DataFrame(kbin_func.transform(
    df[["age"]]).toarray(), columns=["young", "adult", "senior"])

# consolidating a final dataset
df_final = pd.concat([df[int_variables], df_cat, df_age,
                      df[output_variable]], axis=1)
X = pd.concat([df[int_variables], df_cat, df_age], axis=1)
y = df[output_variable].copy()

# Modelling

# set metrics
# performance metrics
perf_metrics = {"Accuracy": metrics.accuracy_score,
                "Precision": metrics.precision_score,
                "Recall": metrics.recall_score,
                "AUC": metrics.roc_auc_score,
                "F1-Score": metrics.f1_score,
                "Brier": metrics.brier_score_loss}
# fairness metrics
fair_metrics = {"Cohen-D": CohenD,
                "2-SD Rule": TwoSDRule,
                "StatParity": StatParity,
                "EqualOppDiff": EqualOppDiff,
                "DispImpact": DispImpact,
                "AvgOddsDiff": AvgOddsDiff
                }

gmaj = df_final['gender_male '].values
gmin = df_final['gender_female '].values

# train model
rf = RandomForestClassifier(
    n_estimators=10, random_state=10, class_weight="balanced")
rf.fit(X, y.values.ravel())

# get predictions -- where you would start, after loading the data and model
ypred_prob = rf.predict_proba(X).ravel()[1::2]  # get probabilities
threshold = 0.5
ypred_class = (ypred_prob >= threshold) * 1.0  # threshold to use as rule

# compute metrics
metrics = []
for pf in perf_metrics.keys():
    if pf in ["AUC", "Brier"]:
        metrics += [[pf, perf_metrics[pf](y.values.ravel(), ypred_prob)]]
    else:
        metrics += [[pf, perf_metrics[pf](y.values.ravel(), ypred_class)]]

for ff in fair_metrics.keys():
    metrics += [[ff, fair_metrics[ff]
                 (y.values.ravel(), ypred_class, gmaj, gmin)]]

pd.DataFrame(metrics, columns=["Metric", "Value"])

print(metrics)

