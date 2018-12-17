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
    logging.debug("getting data")
    df = pd.read_parquet("data/" + str(request.args["hash"]) + ".parquet.sz")

    zone = df.loc[(float(request.args.get("x_max", df.x.max())) >= df.x) &
                  (float(request.args.get("x_min", df.x.min())) <= df.x)].values
    zone = zone.tolist()
    if len(zone) > 5000:
        zone = zone[::int(len(zone) / 5000)]

    return jsonify({"name": request.args["seq_id"],
                    "data": zone,
                    # "marker": True
                    })

@app.route("/fasta", methods=["POST"])
def parse_fasta():
    # takes a fasta file and returns a list of the seq hashes
    results = []

    for seq in read([x.decode("ascii") for x in request.files["sequence"].readlines()], "fasta"):
        logging.debug("hashing")
        seq_hash = str(xxhash.xxh64(str(seq)).intdigest())

        if not os.path.exists("data/" + seq_hash + ".parquet.sz"):
            logging.debug("No existing transformed version of seq. Transforming...")
            transformed = transform(str(seq))
            pd.DataFrame(dict(x=transformed[0], y=transformed[1])).to_parquet("data/" + seq_hash + ".parquet.sz")
        results.append(dict(seq_hash=seq_hash,
                            seq_id=seq.metadata["id"],
                            seq_filename=request.files["sequence"].filename))
    return jsonify(results)


if __name__ == '__main__':
    app.run(debug=True)