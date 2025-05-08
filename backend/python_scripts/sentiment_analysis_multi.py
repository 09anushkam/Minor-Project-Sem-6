import sys
import json
from textblob import TextBlob
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

def predict_sentiment(text):
    try:
        polarity = TextBlob(text).sentiment.polarity
        if polarity > 0.1:
            return 'positive'
        elif polarity < -0.1:
            return 'negative'
        else:
            return 'neutral'
    except Exception as e:
        print(f"Error analyzing text: {str(e)}", file=sys.stderr)
        return 'neutral'  # fallback

try:
    # Read input with proper encoding
    input_str = sys.stdin.buffer.read().decode('utf-8')
    data = json.loads(input_str)

    if not isinstance(data, list):
        raise ValueError("Expected a list of text entries")

    texts = [item.get('text', '') for item in data]
    labels = [item.get('label') for item in data]

    if not texts:
        raise ValueError("No text entries found in input")

    predictions = [predict_sentiment(text) for text in texts]

    response = {
        'sentiments': predictions,
        'texts': texts,
        'output_csv': None
    }

    # Only evaluate if all items have a label
    if all(label is not None for label in labels):
        try:
            accuracy = accuracy_score(labels, predictions)
            precision = precision_score(labels, predictions, average='macro', zero_division=0)
            recall = recall_score(labels, predictions, average='macro', zero_division=0)
            f1 = f1_score(labels, predictions, average='macro', zero_division=0)

            class_labels = ['positive', 'neutral', 'negative']
            cm = confusion_matrix(labels, predictions, labels=class_labels)
            cm_dict = {
                actual: {pred: int(cm[i][j]) for j, pred in enumerate(class_labels)}
                for i, actual in enumerate(class_labels)
            }

            response['metrics'] = {
                'accuracy': round(accuracy, 2),
                'precision': round(precision, 2),
                'recall': round(recall, 2),
                'f1': round(f1, 2),
                'confusion_matrix': cm_dict
            }
        except Exception as e:
            print(f"Error calculating metrics: {str(e)}", file=sys.stderr)
            response['metrics'] = {"error": str(e)}

    # Ensure proper encoding for output
    print(json.dumps(response, ensure_ascii=False))

except Exception as e:
    print(f"Error processing input: {str(e)}", file=sys.stderr)
    error_response = {
        'error': str(e),
        'sentiments': [],
        'texts': []
    }
    print(json.dumps(error_response, ensure_ascii=False))
    sys.exit(1)
