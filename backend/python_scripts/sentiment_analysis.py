#!/usr/bin/env python3
import pandas as pd
import sys
import os
from textblob import TextBlob
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import json

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

    if 'Text' not in df.columns:
        print("CSV must have a 'Text' column")
        sys.exit(1)

    df['predicted_sentiment'] = df['Text'].apply(analyze_sentiment)

    # Check for ground truth column 'label' for evaluation
    metrics = {}
    if 'label' in df.columns:
        y_true = df['label']
        y_pred = df['predicted_sentiment']
        try:
            metrics = {
                'accuracy': accuracy_score(y_true, y_pred),
                'precision': precision_score(y_true, y_pred, average='macro', zero_division=0),
                'recall': recall_score(y_true, y_pred, average='macro', zero_division=0),
                'f1': f1_score(y_true, y_pred, average='macro', zero_division=0),
            }
        except Exception as e:
            print(f"Error calculating metrics: {e}")

    # # Save the results in the same directory as input
    # output_dir = os.path.dirname(input_csv)
    # # output_csv = os.path.join(output_dir, 'output_sentiment.csv')
    # output_csv = 'uploads/output_sentiment.csv'
    # os.makedirs(os.path.dirname(output_csv), exist_ok=True)

    # try:
    #     df.to_csv(output_csv, index=False)
    # except Exception as e:
    #     print(f"Error saving output CSV: {e}")
    #     sys.exit(1)

    # # Print results (stdout will be captured by Node)
    # print(json.dumps({"metrics": metrics, "output_csv": output_csv}))

    output_folder = 'backend/uploads'
    os.makedirs(output_folder, exist_ok=True)

    output_filename = 'output_sentiment.csv'
    output_csv = os.path.join(output_folder, output_filename)
    df.to_csv(output_csv, index=False)

    # Output relative web path for frontend to access
    print(json.dumps({"metrics": metrics, "output_csv": f"uploads/{output_filename}"}))

if __name__ == '__main__':
    main()
