import sqlite3
import json
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from utils import analyze_quartieri, calculate_statistics, do_label
import html

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

@app.route('/get-data', methods=['GET'])
def get_data():
    # Connect to database
    conn = sqlite3.connect("database.db")

    # Create GeoJSON data
    geojson_data = {
        "type": "FeatureCollection",
        "features": []
    }

    # Input parameters
    startDate = request.args.get('startDate', default='')
    endDate = request.args.get('endDate', default='')
    crimes = request.args.get('crimes', default='omicidio,omicidio_colposo,omicidio_stradale,tentato_omicidio,furto,rapina,violenza_sessuale,aggressione,spaccio,truffa,estorsione,associazione_di_tipo_mafioso').split(',')
    quartieri = request.args.get('quartieri', default='bari-vecchia_san-nicola,carbonara,carrassi,ceglie-del-campo,japigia,liberta,loseto,madonnella,murat,palese-macchie,picone,san-paolo,san-pasquale,santo-spirito,stanic,torre-a-mare,san-girolamo_fesca').split(',')
    weightsForArticles = request.args.get('weightsForArticles', default='true')
    weightsForPeople = request.args.get('weightsForPeople', default='false')

    if len(crimes) <= 1 and crimes[0] == '': 
        crimes = 'omicidio,omicidio_colposo,omicidio_stradale,tentato_omicidio,furto,rapina,violenza_sessuale,aggressione,spaccio,truffa,estorsione,associazione_di_tipo_mafioso'

    if len(quartieri) <= 1 and quartieri[0] == '': 
        quartieri = 'bari-vecchia_san-nicola,carbonara,carrassi,ceglie-del-campo,japigia,liberta,loseto,madonnella,murat,palese-macchie,picone,san-paolo,san-pasquale,santo-spirito,stanic,torre-a-mare,san-girolamo_fesca'

    quartieri_array = list(map(str, quartieri))

    # Create a dataframe for quartieri
    quartieri_data = {
        'Quartiere': quartieri_array,
        'Totale crimini': [],
        'Indice di rischio': [],
        'Indice di rischio normalizzato': []
    }

    num_quartieri = len(quartieri_data['Quartiere'])

    quartieri_data['Totale crimini'] = [0] * num_quartieri
    quartieri_data['Indice di rischio'] = [0] * num_quartieri
    quartieri_data['Indice di rischio normalizzato'] = [0] * num_quartieri

    quartieri_df = pd.DataFrame(quartieri_data)

    # Read all articles from the database
    if startDate == '' and endDate == '':
        articles_df = pd.read_sql_query("SELECT * FROM articles", conn)
    else:
        query = f"""
            SELECT * 
            FROM articles 
            WHERE date BETWEEN '{startDate}' AND '{endDate}'
            """
        articles_df = pd.read_sql_query(query, conn)

    # Add features to GeoJSON
    with open("data/quartieri.json", "r", encoding="utf-8") as file:
        geometry_json = json.load(file)
        
    for quartiere in quartieri_array:
        # Find quartiere in geometry JSON
        matching_quartiere = next(
            (feature for feature in geometry_json if feature.get("python_id") == quartiere), None
        )
        
        if matching_quartiere:
            # Create feature
            feature = {
                "type": "Feature",
                "properties": {
                    "name": matching_quartiere["name"],
                    "python_id": matching_quartiere["python_id"]
                },
                "geometry": matching_quartiere["geometry"] 
            }
            # Add it to features
            geojson_data["features"].append(feature)

    # Analysis dei quartieri
    geojson_data = analyze_quartieri(articles_df, quartieri_df, geojson_data, crimes, weightsForArticles, weightsForPeople)

    # Calculate statistics of quartieri
    geojson_data = calculate_statistics(quartieri_df, geojson_data)

    # Close connection
    conn.close()

    return jsonify(geojson_data)

@app.route('/get-articles', methods=['GET'])
def get_articles():
    # Connect to database
    conn = sqlite3.connect("database.db")

    articles_df = pd.read_sql_query("SELECT * FROM articles", conn)

    conn.close()

    return json.dumps(json.loads(articles_df.to_json(orient="records")))

@app.route('/label-articles', methods=['POST'])
def label_articles():
    data = request.get_json()

    jsonFile = data.get("jsonFile")
    quartiere = data.get("quartiere")

    labeled_articles = do_label(jsonFile, quartiere)

    return jsonify(labeled_articles)

@app.route('/upload-to-database', methods=['POST'])
def upload_articles():
    data = request.get_json()

    jsonFile = data.get("jsonFile")

    # Connect to database
    conn = sqlite3.connect("database.db")

    cursor = conn.cursor()

    # Insert data from JSON
    for item in jsonFile:
        cursor.execute('''
        INSERT INTO articles (link, quartiere, title, date, content, omicidio, omicidio_prob, omicidio_colposo, omicidio_colposo_prob, omicidio_stradale, omicidio_stradale_prob, tentato_omicidio, tentato_omicidio_prob, furto, furto_prob, rapina, rapina_prob, violenza_sessuale, violenza_sessuale_prob, aggressione, aggressione_prob, spaccio, spaccio_prob, truffa, truffa_prob, estorsione, estorsione_prob, contrabbando, contrabbando_prob, associazione_di_tipo_mafioso, associazione_di_tipo_mafioso_prob)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            html.escape(item.get('link', '')),
            html.escape(item.get('python_id', '')),
            html.escape(item.get('title', '')),
            html.escape(item.get('date', '')),
            html.escape(item.get('content', '')),
            item['omicidio']['value'], item['omicidio']['prob'],
            item['omicidio_colposo']['value'], item['omicidio_colposo']['prob'],
            item['omicidio_stradale']['value'], item['omicidio_stradale']['prob'],
            item['tentato_omicidio']['value'], item['tentato_omicidio']['prob'],
            item['furto']['value'], item['furto']['prob'],
            item['rapina']['value'], item['rapina']['prob'],
            item['violenza_sessuale']['value'], item['violenza_sessuale']['prob'],
            item['aggressione']['value'], item['aggressione']['prob'],
            item['spaccio']['value'], item['spaccio']['prob'],
            item['truffa']['value'], item['truffa']['prob'],
            item['estorsione']['value'], item['estorsione']['prob'],
            item['contrabbando']['value'], item['contrabbando']['prob'],
            item['associazione_di_tipo_mafioso']['value'], item['associazione_di_tipo_mafioso']['prob']
        ))

    conn.commit()
    conn.close()

    return "Uploaded file succesfully"

if __name__ == '__main__':
    app.run(debug=True)