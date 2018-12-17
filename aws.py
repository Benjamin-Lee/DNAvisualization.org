# coding: utf-8
import boto3
import io
import pandas as pd
import tempfile

s3 = boto3.client('s3')

def exists_on_s3(key, client=s3, bucket="squiggle-data"):
    """return the key's size if it exist, else None"""
    response = client.list_objects_v2(
        Bucket=bucket,
        Prefix=key,
    )
    for obj in response.get('Contents', []):
        if obj['Key'] == key:
            return obj['Size']


def upload(filename):
    return s3.upload_file("data/" + filename,
                          "squiggle-data",
                          filename)

def query_x_range(Key, x_min=None, x_max=None):

    if x_min and x_max:
        Expression = "select * from s3object s where x > {} AND x < {};".format(x_min, x_max)
    else:
        Expression = "select * from s3object s;"

    response = s3.select_object_content(Bucket="squiggle-data",
                                        Key=Key,
                                        Expression=Expression,
                                        ExpressionType="SQL",
                                        InputSerialization={'Parquet': {}},
                                        OutputSerialization={'CSV': {'RecordDelimiter': '\n'}})
    event_stream = response['Payload']
    end_event_received = False
    # data_bytes = io.BytesIO()
    fp = tempfile.TemporaryFile()
    for event in event_stream:
        if 'Records' in event:
            data = event['Records']['Payload']
            fp.write(data)

        # If we received a progress event, print the details
        elif 'Progress' in event:
            print(event['Progress']['Details'])

        # End event indicates that the request finished successfully
        elif 'End' in event:
            end_event_received = True
            fp.seek(0)
            df = pd.read_csv(fp, names=["x", "y", "index"]).drop(columns=["index"])
            fp.close()
            return df

    if not end_event_received:
        fp.close()
        raise Exception("End event not received, request incomplete.")
