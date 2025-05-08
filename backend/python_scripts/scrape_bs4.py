import sys
import json
import requests
from bs4 import BeautifulSoup

print("Python script started", file=sys.stderr)  # Debugging

if len(sys.argv) < 2:
    print(json.dumps({"error": "No URL provided"}))
    sys.exit(1)

url = sys.argv[1]
print(f"Fetching URL: {url}", file=sys.stderr)

try:
    headers = {"User-Agent": "Mozilla/5.0"}  # Avoid blocking by Wikipedia
    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    data = [p.text.strip() for p in soup.find_all("p") if p.text.strip()]

    output = json.dumps({"data": data})
    print(output)
    sys.stdout.flush()  # Force output immediately

except requests.exceptions.RequestException as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)
