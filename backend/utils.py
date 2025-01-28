import pandas as pd
import numpy as np
import math
from sklearn.preprocessing import MinMaxScaler

def analyze_quartieri(articles_df, quartieri_df, geojson_data, selected_crimes, weightsForArticles = 'true'): 
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

    # Filter crimes
    if (len(selected_crimes) > 0):
      filtered_crimes = {k: v for k, v in crimes.items() if k in selected_crimes}
    else:
      filtered_crimes = crimes

    for group, group_df in articles_df.groupby("quartiere"):
      crime_data = {key: {"frequenza": 0, "crime_index_normalizzato": 0} for key in filtered_crimes}

      # Group equals python_id/quartiere
      # Frequency
      for index, row in group_df.iterrows():
          for crime in filtered_crimes.keys():
              if row[crime] == 1:
                  crime_data[crime]["frequenza"] += 1

      # Weighted risk index
      crimini_totali = sum([crime_data[crime]["frequenza"] for crime in crime_data])
      for crime in filtered_crimes.keys():
          risk_index = crime_data[crime]["frequenza"] * weights[crime]
          crime_data[crime]["crime_index"] = risk_index

      # Add to GeoJSON
      for feature in geojson_data["features"]:
          if feature["properties"].get("python_id") == group:
              feature["properties"]["crimini"] = crime_data
              break

      # Weight
      quartieri_df.loc[quartieri_df['Quartiere'] == group, 'Peso quartiere'] = len(group_df.index)
      
      # Total crimes per quartiere
      quartieri_df.loc[quartieri_df['Quartiere'] == group, 'Totale crimini'] = crimini_totali
      
      # Risk index by quartiere
      indice_di_rischio_totale = sum(
          crime_data[crime]["crime_index"] for crime in crime_data
      )
      if weightsForArticles == 'true':
        indice_di_rischio_totale = indice_di_rischio_totale / len(group_df.index) 

      # Save risk index in dataframe
      quartieri_df.loc[quartieri_df['Quartiere'] == group, 'Indice di rischio'] = indice_di_rischio_totale

    scaler = MinMaxScaler(feature_range=(0,100))
    quartieri_df['Indice di rischio scalato'] = scaler.fit_transform(quartieri_df[['Indice di rischio']])
    return geojson_data


def calculate_statistics(quartieri_df, geojson_data): 
    statistiche_dict = {}

    for index, row in quartieri_df.iterrows():
        if math.isnan(row['Peso quartiere']):
            row['Peso quartiere'] = 1.0

        quartiere = row["Quartiere"]
        crimini_totali = row["Totale crimini"]
        crime_index = float(row["Indice di rischio"])
        crime_index_scalato = float((row["Indice di rischio scalato"]))
        
        statistiche_dict[quartiere] = {
            "crimini_totali": crimini_totali,
            "crime_index": round(crime_index, 2),
            "crime_index_scalato": round(crime_index_scalato, 2),
        }

    for feature in geojson_data['features']:
        python_id = feature['properties'].get('python_id')
        if python_id in statistiche_dict:
            data_to_update = {key: int(value) if isinstance(value, (np.int64, np.int32)) 
                              else float(value) if isinstance(value, (np.float64, np.float32)) 
                              else value 
                              for key, value in statistiche_dict[python_id].items()}
            feature['properties'].update(data_to_update)

    return geojson_data
