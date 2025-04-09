#!/usr/bin/env python3
import sys
import json
from textblob import TextBlob

def analyze_sentiment(text):
    polarity = TextBlob(text).sentiment.polarity
    if polarity > 0:
        return 'positive'
    elif polarity < 0:
        return 'negative'
    else:
        return 'neutral'

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No text provided"}))
        sys.exit(1)
    input_text = sys.argv[1]
    sentiment = analyze_sentiment(input_text)
    print(json.dumps({"sentiment": sentiment}))
