import json
import sqlite3

# Percorsi dei file
json_file_path = 'data/dataset.json'  # Percorso del file JSON
db_file_path = './database.db'  # Percorso del database SQLite

# Caricamento del file JSON
with open(json_file_path, 'r', encoding='utf-8') as file:
    json_data = json.load(file)

# Connessione al database SQLite
conn = sqlite3.connect(db_file_path)
cursor = conn.cursor()

# Inserimento dei dati dal file JSON
for item in json_data:
    cursor.execute('''
    INSERT INTO articles (link, python_id, title, date, content, omicidio, omicidio_prob, omicidio_colposo, omicidio_colposo_prob, omicidio_stradale, omicidio_stradale_prob, tentato_omicidio, tentato_omicidio_prob, furto, furto_prob, rapina, rapina_prob, violenza_sessuale, violenza_sessuale_prob, aggressione, aggressione_prob, spaccio, spaccio_prob, truffa, truffa_prob, estorsione, estorsione_prob, contrabbando, contrabbando_prob, associazione_di_tipo_mafioso, associazione_di_tipo_mafioso_prob)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        item['link'],
        item['python_id'],
        item['title'],
        item['date'],
        item['content'],
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

# Salva le modifiche e chiudi la connessione
conn.commit()
conn.close()

print("Dati inseriti correttamente nel database!")