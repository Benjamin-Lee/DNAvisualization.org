# coding: utf-8
import boto3
import io
import pandas as pd
import tempfile
import logging
import os

stage = os.environ.get("STAGE")

s3 = boto3.client("s3")


def exists_on_s3(key, client=s3, bucket=f"dnavisualization-data-{stage}"):
    """return the key's size if it exist, else None"""
    response = client.list_objects_v2(Bucket=bucket, Prefix=key)
    for obj in response.get("Contents", []):
        if obj["Key"] == key:
            return obj["Size"]


def upload(filename):
    return s3.upload_file(
        "data/" + filename, f"dnavisualization-data-{stage}", filename
    )


def query_x_range(Key, x_min=None, x_max=None):

    if x_min and x_max:
        Expression = "select * from s3object s where x > {} AND x < {};".format(
            x_min, x_max
        )
    else:
        Expression = "select * from s3object s;" # TODO:  fix this!!!

    response = s3.select_object_content(
        Bucket=f"dnavisualization-data-{stage}",
        Key=Key,
        Expression=Expression,
        ExpressionType="SQL",
        InputSerialization={"Parquet": {}},
        OutputSerialization={"CSV": {"RecordDelimiter": "\n"}},
    )
    event_stream = response["Payload"]
    end_event_received = False

    # store the CSV output in memory
    data_bytes = io.BytesIO()

    for event in event_stream:
        if "Records" in event:
            data = event["Records"]["Payload"]
            data_bytes.write(data)

        # If we received a progress event, print the details
        elif "Progress" in event:
            print(event["Progress"]["Details"])

        # End event indicates that the request finished successfully
        elif "End" in event:
            end_event_received = True
            data_bytes.seek(0)
            df = pd.read_csv(data_bytes, names=["x", "y", "index"]).drop(
                columns=["index"]
            )
            logging.debug(f"Query results shape: {df.shape}")
            return df

    if not end_event_received:
        raise Exception("End event not received, request incomplete.")
