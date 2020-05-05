import pandas as pd
import numpy as np
from sklearn.preprocessing import OneHotEncoder
from sklearn.preprocessing import KBinsDiscretizer
import functools
import sys
import json
import os

RAW = "raw/"


def preProcessData(df, metadata):

    def split_column(df, column_splitter):
        # TODO impure function!!!
        split_columns = df[column_splitter["sourceColumn"]].str.split(
            ":", n=1, expand=True)
        split_columns.columns = column_splitter["targetColumns"]
        df.drop(column_splitter["sourceColumn"], axis=1, inplace=True)

        return pd.concat([df, split_columns], axis=1)

    def split_columns(column_splitters):
        # TODO impure function!!!
        if column_splitters is None:
            return df
        dfCopy = df.copy()
        for column_splitter in column_splitters:
            dfCopy = split_column(dfCopy, column_splitter)

        return dfCopy

    def oneHotEncodedCatVariables(cat_variables):
        if cat_variables is None:
            return pd.DataFrame()

        df_cat = pd.DataFrame(index=df.index)

        for cat in cat_variables:
            one_hot_func = OneHotEncoder().fit(df[[cat]])
            cat_mapped = one_hot_func.transform(df[[cat]]).toarray()
            for (k, cat_label) in enumerate(one_hot_func.categories_[0]):
                df_cat[cat + "_" + cat_label] = cat_mapped[:, k]

        return df_cat

    def kbinFunc(int_variable):
        return KBinsDiscretizer(
            n_bins=len(int_variable["targetColumns"]),
            encode='onehot',
            strategy='quantile').fit(df[[int_variable["sourceColumn"]]])

    def bracketIntegerVariable(int_variable):
        return pd.DataFrame(kbinFunc(int_variable).transform(
            df[[int_variable["sourceColumn"]]]).toarray(),
            columns=int_variable["targetColumns"])

    def bracketedIntegerVariables(int_splitters):
        return pd.DataFrame() if int_splitters is None else pd.concat(map(bracketIntegerVariable, int_splitters), axis=1)

    def getMetadata(key):
        return metadata[key] if key in metadata else None

    df = split_columns(getMetadata("categoricalSplitters"))

    df_cat = oneHotEncodedCatVariables(getMetadata("categoricalVariables"))
    df_bracket = bracketedIntegerVariables(getMetadata("intSplitters"))
    return pd.concat([df[metadata["intVariables"]],
                      df_cat, df_bracket, df[metadata["outputVariable"]]], axis=1)


def processRawDirectory():
    def changeExtension(filename, ext):
        return os.path.splitext(filename)[0]+ext

    def getRawFileDict(csvFilename):
        return {
            "source": f"{RAW}{csvFilename}",
            "json": f"{RAW}{changeExtension(csvFilename, '.json')}",
            "out": f"processed/{csvFilename}"
        }

    def getRawFiles():
        return [getRawFileDict(file) for file in os.listdir(RAW) if file.endswith(".csv")]

    for file in getRawFiles():
        processFile(file["source"], file["json"], file["out"])
        print(file["out"])


def processFile(filename, metadataFilename, outfilename):
    def readMetadata():
        json_file = open(metadataFilename, "r")
        metadata = json.load(json_file)
        json_file.close()
        return metadata

    preProcessData(
        pd.read_csv(filename),
        readMetadata()).to_csv(outfilename, index=False)


if __name__ == "__main__":
    outfilename = sys.argv[3] if len(sys.argv) >= 4 else "out.csv"
    if len(sys.argv) > 1:
        processFile(sys.argv[1], sys.argv[2], outfilename)
    else:
        processRawDirectory()
