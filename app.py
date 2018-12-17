#!flask/bin/python
from flask import Flask, request, jsonify, render_template
from squiggle import transform
from skbio.io import read
import pandas as pd
import xxhash
import os.path

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/seq_query")
def seq_query():
    # takes a seq hash and returns a downsampled region
    df = pd.read_csv("data/" + str(request.args["hash"]) + ".csv")
    zone = df.loc[(float(request.args.get("x_max", df.x.max())) >= df.x) &
                  (float(request.args.get("x_min", df.x.min())) <= df.x)].values

    zone = zone.tolist()
    if len(zone) > 5000:
        zone = zone[::int(len(zone) / 5000)]

    return jsonify({"name": request.args["seq_id"],
                    "data": zone,
                    "marker": False})

@app.route("/fasta", methods=["POST"])
def parse_fasta():
    # takes a fasta file and returns a list of the seq hashes
    results = []

    for seq in read([x.decode("ascii") for x in request.files["sequence"].readlines()], "fasta"):
        transformed = list(zip(*transform(str(seq))))
        seq_hash = str(xxhash.xxh64(str(seq)).intdigest())
        if not os.path.exists("data/" + seq_hash + ".csv"):
            with open("data/" + seq_hash + ".csv", "w+") as f:
                f.write("x,y\n")
                for coord in transformed:
                    f.write("%f,%f\n" % (coord[0], coord[1]))
        results.append(dict(seq_hash=seq_hash,
                            seq_id=seq.metadata["id"],
                            seq_filename=request.files["sequence"].filename))
    return jsonify(results)


if __name__ == '__main__':
    app.run(debug=True)
