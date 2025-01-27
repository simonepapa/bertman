import sqlite3
import json
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from utils import analyze_quartieri, calculate_statistics

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

import models

@app.route('/get-data', methods=['GET'])
def get_data():
    # Connect to database
    conn = sqlite3.connect("database.db")

    geojson_file = "data/quartieri.geojson"

    # Carica il file GeoJSON
    with open(geojson_file, "r", encoding="utf-8") as file:
        data = json.load(file)

    date = request.args.get('date', default='')
    crimes = request.args.get('crimes', default='omicidio,omicidio_colposo,omicidio_stradale,tentato_omicidio,furto,rapina,violenza_sessuale,aggressione,spaccio,truffa,estorsione,associazione_di_tipo_mafioso').split(',')
    quartieri = ["bari-vecchia_san-nicola", "carbonara", "carrassi", "ceglie-del-campo", "japigia", "liberta", "loseto", "madonnella", "murat", "palese-macchie", "picone", "san-paolo", "san-pasquale", "santo-spirito", "stanic", "torre-a-mare", "san-girolamo_fesca"]

    quartieri_data = {
        'Quartiere': quartieri,
        'Totale crimini': [],
        'Indice di rischio': [],
        'Indice di rischio normalizzato': []
    }

    num_quartieri = len(quartieri_data['Quartiere'])

    quartieri_data['Totale crimini'] = [0] * num_quartieri
    quartieri_data['Indice di rischio'] = [0] * num_quartieri
    quartieri_data['Indice di rischio normalizzato'] = [0] * num_quartieri

    quartieri_df = pd.DataFrame(quartieri_data)

    articles_df = pd.read_sql_query("SELECT * FROM articles", conn)

    data = analyze_quartieri(articles_df, quartieri_df, data, crimes)
#
    data = calculate_statistics(quartieri_df, data)

    # Close connection
    conn.close()

    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)