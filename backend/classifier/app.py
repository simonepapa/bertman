from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import do_label

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/classifier/label-articles', methods=['POST'])
def label_articles():
    data = request.get_json()

    jsonFile = data.get("jsonFile")
    quartiere = data.get("quartiere")

    labeled_articles = do_label(jsonFile, quartiere)

    return jsonify(labeled_articles)

if __name__ == '__main__':
    app.run(debug=True)