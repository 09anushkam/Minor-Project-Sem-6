#!/usr/bin/env python3
import pandas as pd
import sys
import os
import json
from textblob import TextBlob
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
)

def analyze_sentiment(text):
    polarity = TextBlob(str(text)).sentiment.polarity
    if polarity > 0:
        return 'positive'
    elif polarity < 0:
        return 'negative'
    else:
        return 'neutral'

def main():
    if len(sys.argv) < 2:
        print("Usage: sentiment_analysis.py <input_csv_path>")
        sys.exit(1)

    input_csv = sys.argv[1]
    try:
        df = pd.read_csv(input_csv)
    except Exception as e:
        print(f"Error reading CSV: {e}")
        sys.exit(1)

    if 'text' not in df.columns:
        print("CSV must have a 'text' column")
        sys.exit(1)

    df['predicted_sentiment'] = df['text'].apply(analyze_sentiment)

    metrics = {}
    if 'label' in df.columns:
        y_true = df['label']
        y_pred = df['predicted_sentiment']
        try:
            accuracy = accuracy_score(y_true, y_pred)
            precision = precision_score(y_true, y_pred, average='macro', zero_division=0)
            recall = recall_score(y_true, y_pred, average='macro', zero_division=0)
            f1 = f1_score(y_true, y_pred, average='macro', zero_division=0)

            labels = ['positive', 'neutral', 'negative']
            cm = confusion_matrix(y_true, y_pred, labels=labels)
            cm_dict = {
                actual: {pred: int(cm[i][j]) for j, pred in enumerate(labels)}
                for i, actual in enumerate(labels)
            }

            metrics = {
                'accuracy': accuracy,
                'precision': precision,
                'recall': recall,
                'f1': f1,
                'confusion_matrix': cm_dict
            }

        except Exception as e:
            print(f"Error calculating metrics: {e}")

    output_folder = 'backend/uploads'
    os.makedirs(output_folder, exist_ok=True)

    output_filename = 'output_sentiment.csv'
    output_csv = os.path.join(output_folder, output_filename)
    df.to_csv(output_csv, index=False)

    response = {
        "sentiments": df['predicted_sentiment'].tolist(),
        "cleaned_texts": df['text'].astype(str).tolist(),
        "output_csv": f"uploads/{output_filename}"
    }

    if metrics:
        response["metrics"] = metrics

    print(json.dumps(response))

if __name__ == '__main__':
    main()
