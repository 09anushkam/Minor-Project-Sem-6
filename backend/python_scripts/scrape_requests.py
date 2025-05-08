import sys
import io
import requests
import json
import re

# Fix encoding issue
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def scrape_and_filter(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        html = response.text

        # Regex patterns
        title = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE | re.DOTALL)
        headings = re.findall(r'<h[1-3][^>]*>(.*?)</h[1-3]>', html, re.IGNORECASE | re.DOTALL)
        paragraphs = re.findall(r'<p[^>]*>(.*?)</p>', html, re.IGNORECASE | re.DOTALL)
        links = re.findall(r'<a[^>]+href=["\'](.*?)["\']', html, re.IGNORECASE)

        data = {
            "title": title.group(1).strip() if title else None,
            "headings": [h.strip() for h in headings],
            "paragraphs": [p.strip() for p in paragraphs],
            "links": links,
        }

        print(json.dumps(data, ensure_ascii=False))  # allow Unicode output
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    if len(sys.argv) > 1:
        scrape_and_filter(sys.argv[1])
    else:
        print(json.dumps({"error": "URL not provided"}))
