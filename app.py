#!flask/bin/python
from flask import Flask, request, jsonify, render_template
from squiggle import transform
from skbio.io import read
import pandas as pd
import xxhash
import os.path
import logging

from aws import exists_on_s3, upload, query_x_range

logging.basicConfig(level=logging.DEBUG)
logging.getLogger('botocore').setLevel(logging.INFO)
logging.getLogger('urllib3').setLevel(logging.INFO)
logging.getLogger('s3transfer').setLevel(logging.INFO)


LOCAL = False
logging.info("Running locally" if LOCAL else "Running on AWS")

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/seq_query")
def seq_query():
    # takes a seq hash and returns a downsampled region
    logging.debug(f"Getting data for seq ID {request.args['seq_hash']}")

    if LOCAL:
        df = pd.read_parquet("data/" + str(request.args["seq_hash"]) + ".parquet.sz")
    else:
        df = query_x_range(str(request.args["seq_hash"]) + ".parquet.sz",
                           request.args.get("x_min"),
                           request.args.get("x_max"))

    logging.debug("Got the data")

    zone = df.loc[(float(request.args.get("x_max", df.x.max())) >= df.x) &
                  (float(request.args.get("x_min", df.x.min())) <= df.x)].values
    zone = zone.tolist()

    # downsample if > 5000 points
    # TODO: ensure that the first and last data points in the range are included
    if len(zone) > 5000:
        downsample = int(len(zone) / 5000)
        logging.debug(f"Downsampling by a factor of {downsample}")
        zone = zone[::downsample]

    return jsonify({"name": request.args["seq_id"],
                    "data": zone,
                    # "marker": True # for some reason this generates a ton of errors
                    })

@app.route("/fasta", methods=["POST"])
def parse_fasta():
    # takes a fasta file and returns a list of the seq hashes
    results = []

    for seq in read([x.decode("ascii") for x in request.files["sequence"].readlines()], "fasta"):

        logging.debug("Hashing seq")
        seq_hash = str(xxhash.xxh64(str(seq)).intdigest())

        if LOCAL:
            exists = os.path.exists("data/" + seq_hash + ".parquet.sz")
            logging.debug(f"Found {seq_hash} locally")
        else:
            exists = exists_on_s3(seq_hash + ".parquet.sz")
            logging.debug(f"Found {seq_hash} on S3")

        if not exists:
            logging.debug("No previous transformation found. Transforming...")
            transformed = transform(str(seq))

            logging.debug("Saving transformed data for " + seq.metadata["id"])
            pd.DataFrame(dict(x=transformed[0], y=transformed[1])).to_parquet("data/" + seq_hash + ".parquet.sz")

            if not LOCAL:
                logging.debug(f"Uploading {seq_hash} to S3")
                upload(seq_hash + ".parquet.sz")

        results.append(dict(seq_hash=seq_hash,
                            seq_id=seq.metadata["id"],
                            seq_filename=request.files["sequence"].filename))

    return jsonify(results)


if __name__ == '__main__':
    app.run(debug=True)
