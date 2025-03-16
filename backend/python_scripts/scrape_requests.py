import sys
import requests
import json

url = sys.argv[1]
response = requests.get(url)
print(json.dumps({"html": response.text}))
