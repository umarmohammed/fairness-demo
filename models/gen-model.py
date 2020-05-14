import pandas as pd
from sklearn.linear_model import LogisticRegression
import sys
from joblib import dump
import os

PROCESSED_DATA = "../data/processed/"


def build_model(data_filename):
    df = pd.read_csv(data_filename)
    X = df[df.columns[:-1]]
    y = df[df.columns[-1]]
    rf = LogisticRegression(random_state=10, class_weight="balanced", C=0.0025)
    rf.fit(X, y.values.ravel())
    return {"X": X, "y": y, "model": rf}


def changeExtension(filename, ext):
    return os.path.splitext(filename)[0]+ext


def getOutfilename(argv):
    return argv[2] if len(argv) >= 3 else "out.joblib"


def getFilenames(filename):
    return {
        "data": f"{PROCESSED_DATA}{filename}",
        "out": f"{changeExtension(filename, '.joblib')}"
    }


def getCsvsInDataFolder():
    return [getFilenames(file) for file in os.listdir(PROCESSED_DATA) if file.endswith(".csv")]


def processDataFolder():
    for file in getCsvsInDataFolder():
        processFile(file["data"], file["out"])


def processFile(filename, outfilename):
    dump(build_model(filename), outfilename)


if __name__ == "__main__":
    if len(sys.argv) > 1:
        processFile(sys.argv[1], getOutfilename(sys.argv))
    else:
        processDataFolder()
