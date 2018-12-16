#!flask/bin/python
from flask import Flask, request, jsonify, render_template
from bokeh.palettes import Category10
from squiggle import transform
from skbio.io import read
import pandas as pd
import xxhash


app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/seq_query")
def seq_query():

    df = pd.read_csv("data/" + str(request.args["hash"]) + ".csv")
    zone = df.loc[(float(request.args.get("x_max", df.x.max())) >= df.x) &
                  (float(request.args.get("x_min", df.x.min())) <= df.x)].values

    # seq_number = int(request.args.get("seq_number"))
    # if seq_number > len(Category10):
    #     seq_color = Category10[3][0]
    # else:
    #     seq_color = Category10[seq_number + 1 if seq_number > 2 else 3][seq_number]

    return jsonify({"name": request.args["hash"],
                    "data": zone.tolist(),
                    "color": "black",
                    "marker": False})

@app.route("/fasta", methods=["POST"])
def parse_fasta():
    results = []
    for seq in read([x.decode("ascii") for x in request.files["sequence"].readlines()], "fasta"):
        transformed = list(zip(*transform(str(seq))))
        seq_hash = str(xxhash.xxh64(str(seq)).intdigest())
        with open("data/" + seq_hash + ".csv", "w+") as f:
            f.write("x,y\n")
            for coord in transformed:
                f.write("%f,%f\n" % (coord[0], coord[1]))

        results.append(seq_hash)
    # print(sum([len(result["data"]) for result in results]), "points")
    return jsonify(results)


if __name__ == '__main__':
    app.run(debug=True)
