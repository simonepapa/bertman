import pandas as pd
import numpy as np

def analyze_quartieri(articles_df, quartieri_df, data, selected_crimes): 
    crimes = {
        "omicidio": 0,
        "omicidio_colposo": 0,
        "omicidio_stradale": 0,
        "tentato_omicidio": 0,
        "furto": 0,
        "rapina": 0,
        "violenza_sessuale": 0,
        "aggressione": 0,
        "spaccio": 0,
        "truffa": 0,
        "estorsione": 0,
        "contrabbando": 0,
        "associazione_di_tipo_mafioso": 0,
    }
    weights = {
        "omicidio": 1, "omicidio_colposo": 0.7, "omicidio_stradale": 0.8, "tentato_omicidio": 0.9,
        "furto": 0.2, "rapina": 0.7, "violenza_sessuale": 0.8, "aggressione": 0.6,
        "spaccio": 0.5, "truffa": 0.3, "estorsione": 0.6, "contrabbando": 0.4,
        "associazione_di_tipo_mafioso": 1,
    }

    # Filtra i dizionari rimuovendo i crimini non selezionati
    if (len(selected_crimes) > 0):
      filtered_crimes = {k: v for k, v in crimes.items() if k in selected_crimes}
    else:
      filtered_crimes = crimes

    for group, group_df in articles_df.groupby("python_id"):
      crime_data = {key: {"frequenza": 0, "crime_index_normalizzato": 0} for key in filtered_crimes}

      # Group equals python_id
      # Frequency
      for index, row in group_df.iterrows():
          for crime in filtered_crimes.keys():
              if row[crime] == 1:
                  crime_data[crime]["frequenza"] += 1

      # Normalized risk index
      crimini_totali = sum([crime_data[crime]["frequenza"] for crime in crime_data])
      for crime in filtered_crimes.keys():
          risk_index = crime_data[crime]["frequenza"] * weights[crime] * 100
          crime_data[crime]["crime_index_normalizzato"] = round(
              risk_index / crimini_totali if crimini_totali > 0 else 0, 2
          )

      # Add to GeoJSON
      for feature in data["features"]:
          if feature["properties"].get("python_id") == group:
              feature["properties"]["crimini"] = crime_data
              break

      # Weight
      quartieri_df.loc[quartieri_df['Quartiere'] == group, 'Peso quartiere'] = len(group_df.index)
      
      # Total crimes per quartiere
      quartieri_df.loc[quartieri_df['Quartiere'] == group, 'Totale crimini'] = crimini_totali
      
      # Risk index by quartiere
      indice_di_rischio_totale = sum(
          crime_data[crime]["frequenza"] * weights[crime] for crime in crime_data
      )
      quartieri_df.loc[quartieri_df['Quartiere'] == group, 'Indice di rischio'] = indice_di_rischio_totale

    return data


def calculate_statistics(quartieri_df, data): 
    indice_rischio_totale_di_tutti_i_quartieri = quartieri_df['Indice di rischio'].sum()

    quartieri_df
    statistiche_dict = {}
    for index, row in quartieri_df.iterrows():
        quartiere = row["Quartiere"]
        crimini_totali = row["Totale crimini"]
        crime_index_normalizzato = float(row["Indice di rischio"] / indice_rischio_totale_di_tutti_i_quartieri) * 100
        crime_index_normalizzato_pesato = float((row["Indice di rischio"] / indice_rischio_totale_di_tutti_i_quartieri) * row["Peso quartiere"]) * 100
        
        statistiche_dict[quartiere] = {
            "crimini_totali": crimini_totali,
            "crime_index_normalizzato": round(crime_index_normalizzato, 2),
            "crime_index_normalizzato_pesato": round(crime_index_normalizzato_pesato, 2),
        }

    for feature in data['features']:
        python_id = feature['properties'].get('python_id')
        if python_id in statistiche_dict:
            data_to_update = {key: int(value) if isinstance(value, (np.int64, np.int32)) 
                              else float(value) if isinstance(value, (np.float64, np.float32)) 
                              else value 
                              for key, value in statistiche_dict[python_id].items()}
            feature['properties'].update(data_to_update)

    return data
