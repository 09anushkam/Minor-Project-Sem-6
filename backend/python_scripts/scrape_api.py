# import sys
# import tweepy
# import json

# api_key = "your_twitter_api_key"
# api_secret = "your_twitter_api_secret"

# query = sys.argv[1]
# auth = tweepy.OAuthHandler(api_key, api_secret)
# api = tweepy.API(auth)

# tweets = api.search_tweets(q=query, count=5)
# data = [{"text": tweet.text, "user": tweet.user.screen_name} for tweet in tweets]
# print(json.dumps(data))

# --------------------------------------------------------------------------------------

import sys
import tweepy
import json

# Replace with your actual API credentials
bearer_token = "AAAAAAAAAAAAAAAAAAAAACi5zwEAAAAA8Z5wsMRpcq6oO1ozI2fMyGSR8R0%3D06tAJJx01a2bJ7hum9To6cc8aM4JSlVF5KQgxVW25uv3mu2nOr"

# Initialize Tweepy Client
client = tweepy.Client(bearer_token=bearer_token)

# Get search query from command-line arguments
query = sys.argv[1]

# Fetch recent tweets
tweets = client.search_recent_tweets(query=query, max_results=5, tweet_fields=["author_id"])

# Extract tweet data
data = [{"text": tweet.text, "id": tweet.id} for tweet in tweets.data] if tweets.data else []

# Print JSON result
print(json.dumps(data, indent=2))


# API Key: nWCZ0OlkGFzb4SOAsgke9mN9e

# API Key Secret: qnnQUzupPJi0cweYc8BQS9RMpz9hrUQ9KnLM6NetLaVqh8HDlS

# Bearer Token: AAAAAAAAAAAAAAAAAAAAACi5zwEAAAAA8Z5wsMRpcq6oO1ozI2fMyGSR8R0%3D06tAJJx01a2bJ7hum9To6cc8aM4JSlVF5KQgxVW25uv3mu2nOr

# Access Token: 1900496573009911808-UA10Ysj4IhH6euWuJmFbmuEnHpB7r2

# Access Token Secret: cxWMQAyrozc3rFuEUPF0adSDni9eYKxTcpEmz17Uws7nY