import pandas as pd
import numpy as np
import math
from sklearn.preprocessing import MinMaxScaler

number_of_people = {
    "bari-vecchia_san-nicola": 5726,
    "carbonara": 22625,
    "carrassi": 34248,
    "ceglie-del-campo": 5018,
    "japigia": 30153,
    "liberta": 38701,
    "loseto": 7580,
    "madonnella": 10680,
    "murat": 29638,
    "palese-macchie": 7315,
    "picone": 40225,
    "san-paolo": 27990,
    "san-pasquale": 18313,
    "santo-spirito": 1858,
    "stanic": 4489,
    "torre-a-mare": 5070,
    "san-girolamo_fesca": 4721,
}

def analyze_quartieri(articles_df, quartieri_df, geojson_data, selected_crimes, weightsForArticles = 'true', weightsForPeople = 'false', minmaxScaler = 'true'): 
    scaler = MinMaxScaler(feature_range=(0,100))

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
      crime_data = {key: {"frequenza": 0, "crime_index": 0} for key in filtered_crimes}

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
      if weightsForPeople == 'true':
        indice_di_rischio_totale = indice_di_rischio_totale / number_of_people[group]

      if minmaxScaler == 'true':
        # Scale individual risk indices too
        np_values = [crime_data[crime]["crime_index"] for crime in crime_data]
        values_array = np.array(np_values).reshape(-1, 1)
        scaled_values = scaler.fit_transform(values_array)  
        for idx, crime in enumerate(crime_data):
            crime_data[crime]["crime_index"] = float(scaled_values[idx, 0])

      # Add to GeoJSON
      for feature in geojson_data["features"]:
          if feature["properties"].get("python_id") == group:
              feature["properties"]["crimini"] = crime_data
              break

      # Save risk index in dataframe
      if weightsForPeople == 'true':
        quartieri_df.loc[quartieri_df['Quartiere'] == group, 'Indice di rischio'] = indice_di_rischio_totale * 10000
      else:
        quartieri_df.loc[quartieri_df['Quartiere'] == group, 'Indice di rischio'] = indice_di_rischio_totale

    quartieri_df['Indice di rischio scalato'] = scaler.fit_transform(quartieri_df[['Indice di rischio']])

    geojson_data["weightsForArticles"] = weightsForArticles
    geojson_data["weightsForPeople"] = weightsForPeople
    geojson_data["minmaxScaler"] = minmaxScaler

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
            "population": number_of_people[quartiere]
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

def do_label(jsonFile, quartiere):
    import torch
    import pandas as pd
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # Load JSON, make it a dataframe
    df = pd.DataFrame(jsonFile)
    df = df.drop(columns=['link', 'title', 'date'])
    df["omicidio"] = 0	
    df["omicidio_colposo"] = 0	
    df["omicidio_stradale"] = 0	
    df["tentato_omicidio"] = 0	
    df["furto"] = 0	
    df["rapina"] = 0	
    df["violenza_sessuale"] = 0	
    df["aggressione"] = 0	
    df["spaccio"] = 0	
    df["truffa"] = 0	
    df["estorsione"] = 0	
    df["contrabbando"] = 0	
    df["associazione_di_tipo_mafioso"] = 0

    # Needed to classify
    cols = df.columns.tolist()
    labels = cols[1:]
    id2label = {idx:label for idx, label in enumerate(labels)}
    label2id = {label:idx for idx, label in enumerate(labels)}

    # Load model
    checkpoint = 'data/bert_fine_tuned_model'
    from transformers import AutoModelForSequenceClassification,AutoTokenizer
    tokenizer = AutoTokenizer.from_pretrained(checkpoint)
    model = AutoModelForSequenceClassification.from_pretrained(checkpoint,
                                                            problem_type="multi_label_classification",
                                                            num_labels=len(labels),
                                                            id2label=id2label,
                                                            label2id=label2id)
    model.to(device)

    # Apply model to label articles
    sigmoid = torch.nn.Sigmoid()
    
    for article in jsonFile:
        content = article.get("content", "")
        python_id = {"python_id": quartiere}
        article.update(python_id)
        if content:
            # Tokenize content
            encoding = tokenizer(content, return_tensors="pt", truncation=True, max_length=512)
            encoding = {k: v.to(model.device) for k, v in encoding.items()}
    
            # Calculate probability
            with torch.no_grad():
                outputs = model(**encoding)
            logits = outputs.logits
            probs = sigmoid(logits.squeeze().cpu())
    
            # 1 if prob >75% else 0
            label_scores = {
                labels[idx]: {"value": int(prob > 0.75), "prob": round(prob.item(), 2)}
                for idx, prob in enumerate(probs.numpy())
            }
    
            #  Add labels
            article.update(label_scores)
        else:
            article.update({label: 0 for label in labels})  # No labels if no content

    return jsonFile

