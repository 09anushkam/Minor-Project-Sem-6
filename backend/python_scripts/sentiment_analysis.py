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
        print("Usage: sentiment_analysis.py <input_csv_path>", file=sys.stderr)
        sys.exit(1)

    input_csv = sys.argv[1]
    try:
        df = pd.read_csv(input_csv)
    except Exception as e:
        print(f"Error reading CSV: {e}", file=sys.stderr)
        sys.exit(1)

    if 'text' not in df.columns:
        print("CSV must have a 'text' column", file=sys.stderr)
        sys.exit(1)

    # Run sentiment analysis
    df['predicted_sentiment'] = df['text'].apply(analyze_sentiment)

    metrics = {}
    if 'label' in df.columns:
        sentiment_map = {
            # POSITIVE
            'joy': 'positive', 'enjoyment': 'positive', 'adoration': 'positive', 'euphoria': 'positive',
            'empowerment': 'positive', 'compassion': 'positive', 'tenderness': 'positive', 'arousal': 'positive',
            'fulfillment': 'positive', 'reverence': 'positive', 'hopeful': 'positive', 'proud': 'positive',
            'grateful': 'positive', 'empathetic': 'positive', 'compassionate': 'positive', 'free-spirited': 'positive',
            'inspired': 'positive', 'confident': 'positive', 'overjoyed': 'positive', 'motivation': 'positive',
            'joyfulreunion': 'positive', 'satisfaction': 'positive', 'appreciation': 'positive', 'wonderment': 'positive',
            'optimism': 'positive', 'enchantment': 'positive', 'intrigue': 'positive', 'playfuljoy': 'positive',
            'mindfulness': 'positive', 'dreamchaser': 'positive', 'elegance': 'positive', 'whimsy': 'positive',
            'pensive': 'positive', 'harmony': 'positive', 'creativity': 'positive', 'radiance': 'positive',
            'rejuvenation': 'positive', 'coziness': 'positive', 'adventure': 'positive', 'melodic': 'positive',
            'festivejoy': 'positive', 'innerjourney': 'positive', 'dazzle': 'positive', 'adrenaline': 'positive',
            'artisticburst': 'positive', 'culinaryodyssey': 'positive', 'resilience': 'positive', 'immersion': 'positive',
            'spark': 'positive', 'marvel': 'positive', 'amazement': 'positive', 'captivation': 'positive',
            'tranquility': 'positive', 'grandeur': 'positive', 'emotion': 'positive', 'energy': 'positive',
            'charm': 'positive', 'colorful': 'positive', 'hypnotic': 'positive', 'connection': 'positive',
            'iconic': 'positive', 'journey': 'positive', 'engagement': 'positive', 'touched': 'positive',
            'triumph': 'positive', 'heartwarming': 'positive', 'solace': 'positive', 'breakthrough': 'positive',
            'joy in baking': 'positive', 'envisioning history': 'positive', 'imagination': 'positive',
            'vibrancy': 'positive', 'mesmerizing': 'positive', 'culinary adventure': 'positive', 'winter magic': 'positive',
            'thrilling journey': 'positive', "nature's beauty": 'positive', 'celestial wonder': 'positive',
            'creative inspiration': 'positive', 'runway creativity': 'positive', "ocean's freedom": 'positive',
            'whispers of the past': 'positive', 'relief': 'positive', 'happy': 'positive', 'excitement': 'positive',
            'positive': 'positive', 'happiness': 'positive', 'love': 'positive', 'amusement': 'positive',
            'admiration': 'positive', 'affection': 'positive', 'awe': 'positive', 'acceptance': 'positive',
            'elation': 'positive', 'contentment': 'positive', 'serenity': 'positive', 'gratitude': 'positive',
            'hope': 'positive', 'enthusiasm': 'positive', 'curiosity': 'positive', 'zest': 'positive',
            'playful': 'positive', 'inspiration': 'positive', 'contemplation': 'positive', 'blessed': 'positive',
            'reflection': 'positive', 'confidence': 'positive', 'accomplishment': 'positive', 'wonder': 'positive',
            'freedom': 'positive', 'positivity': 'positive', 'kindness': 'positive', 'friendship': 'positive',
            'success': 'positive', 'exploration': 'positive', 'romance': 'positive', 'celebration': 'positive',
            'ecstasy': 'positive', 'pride': 'positive', 'thrill': 'positive',

            # NEGATIVE
            'sadness': 'negative', 'disgust': 'negative', 'disappointed': 'negative', 'bitter': 'negative',
            'helplessness': 'negative', 'yearning': 'negative', 'fearful': 'negative', 'jealous': 'negative',
            'frustrated': 'negative', 'envious': 'negative', 'bittersweet': 'negative', 'suffering': 'negative',
            'emotionalstorm': 'negative', 'lostlove': 'negative', 'darkness': 'negative', 'desperation': 'negative',
            'ruins': 'negative', 'heartache': 'negative', 'solitude': 'negative', 'obstacle': 'negative',
            'sympathy': 'negative', 'pressure': 'negative', 'renewed effort': 'negative', 'miscalculation': 'negative',
            'challenge': 'negative', 'negative': 'negative', 'anger': 'negative', 'fear': 'negative',
            'shame': 'negative', 'despair': 'negative', 'grief': 'negative', 'loneliness': 'negative',
            'jealousy': 'negative', 'resentment': 'negative', 'frustration': 'negative', 'boredom': 'negative',
            'anxiety': 'negative', 'intimidation': 'negative', 'envy': 'negative', 'regret': 'negative',
            'bitterness': 'negative', 'apprehensive': 'negative', 'overwhelmed': 'negative', 'devastated': 'negative',
            'dismissive': 'negative', 'heartbreak': 'negative', 'betrayal': 'negative', 'isolation': 'negative',
            'disappointment': 'negative', 'exhaustion': 'negative', 'sorrow': 'negative', 'desolation': 'negative',
            'loss': 'negative', 'sad': 'negative', 'hate': 'negative', 'bad': 'negative', 'embarrassed': 'negative',
            'mischievous': 'negative',

            # NEUTRAL
            'surprise': 'neutral', 'anticipation': 'neutral', 'kind': 'neutral', 'nostalgia': 'neutral',
            'suspense': 'neutral', 'determination': 'neutral', 'calmness': 'neutral', 'neutral': 'neutral',
            'confusion': 'neutral', 'indifference': 'neutral', 'numbness': 'neutral', 'melancholy': 'neutral',
            'ambivalence': 'neutral'
        }

        label_col = df['label'].astype(str).str.strip().str.lower()
        df['mapped_label'] = label_col.map(sentiment_map)

        unmapped = label_col[~label_col.isin(sentiment_map.keys())].unique()
        if len(unmapped):
            print(f"Unmapped labels skipped: {list(unmapped)}", file=sys.stderr)

        eval_df = df.dropna(subset=['mapped_label'])

        if not eval_df.empty:
            try:
                y_true = eval_df['mapped_label']
                y_pred = eval_df['predicted_sentiment']

                labels = ['positive', 'neutral', 'negative']
                accuracy = accuracy_score(y_true, y_pred)
                precision = precision_score(y_true, y_pred, average='macro', zero_division=0)
                recall = recall_score(y_true, y_pred, average='macro', zero_division=0)
                f1 = f1_score(y_true, y_pred, average='macro', zero_division=0)

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
                print(f"Error calculating metrics: {e}", file=sys.stderr)
        else:
            print("No valid mapped labels for evaluation", file=sys.stderr)

    # Step 3: Save output
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
