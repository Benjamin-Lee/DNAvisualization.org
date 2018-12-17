#!flask/bin/python
from flask import Flask, request, jsonify, render_template
from squiggle import transform
from skbio.io import read
import pandas as pd
import xxhash
import os.path
import logging

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/seq_query")
def seq_query():
    # takes a seq hash and returns a downsampled region
    logging.debug("Getting data for seq ID {}".format(request.args["seq_hash"]))
    df = pd.read_parquet("data/" + str(request.args["seq_hash"]) + ".parquet.sz")

    zone = df.loc[(float(request.args.get("x_max", df.x.max())) >= df.x) &
                  (float(request.args.get("x_min", df.x.min())) <= df.x)].values
    zone = zone.tolist()

    # downsample if > 5000 points
    # TODO: ensure that the first and last data points in the range are included
    if len(zone) > 5000:
        zone = zone[::int(len(zone) / 5000)]

    return jsonify({"name": request.args["seq_id"],
                    "data": zone,
                    # "marker": True # for some reason this generates a ton of errors
                    })

@app.route("/fasta", methods=["POST"])
def parse_fasta():
    # takes a fasta file and returns a list of the seq hashes
    results = []

    for seq in read([x.decode("ascii") for x in request.files["sequence"].readlines()], "fasta"):

        logging.debug("hashing")
        seq_hash = str(xxhash.xxh64(str(seq)).intdigest())

        if not os.path.exists("data/" + seq_hash + ".parquet.sz"):
            logging.debug("No existing transformed version of {}. Transforming...".format(seq.metadata["id"]))
            transformed = transform(str(seq))

            logging.debug("Saving transformed data for " + seq.metadata["id"])
            pd.DataFrame(dict(x=transformed[0], y=transformed[1])).to_parquet("data/" + seq_hash + ".parquet.sz")
        else:
            logging.debug("Existing transformation found.")
        results.append(dict(seq_hash=seq_hash,
                            seq_id=seq.metadata["id"],
                            seq_filename=request.files["sequence"].filename))
    return jsonify(results)


if __name__ == '__main__':
    app.run(debug=True)
