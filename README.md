<p align ="center">
<img src='https://github.com/Benjamin-Lee/dnavisualization.org/raw/master/static/images/wordmark.png' height="150">
</p>

This is the repository for [DNAvisualization.org](https://DNAvisualization.org), a web tool to turn DNA sequences into interactive visualizations.

## Development

To get the server working locally, first clone the repo:

```bash
git clone https://github.com/Benjamin-Lee/DNAvisualization.org.git
cd DNAvisualization.org.git
```

Then install the dependencies in a [virtualenv](https://virtualenv.pypa.io/en/latest/):
```bash
pip install -r requirements.txt
```

And run the app:
```bash
python app.py
```

Note that it will attempt to autodetect if it's running in Lambda by looking for the environment variable `AWS_LAMBDA_FUNCTION_NAME`. If running locally, no calls to Lambda will be made, only to the local app. Do note that the development server is single-threaded, so you won't see the performance boost that Lambda provides.

Deploying to Lambda is as easy as:

```bash
zappa deploy dev
```
