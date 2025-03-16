import scrapy
import sys
import json

class SocialMediaSpider(scrapy.Spider):
    name = "social_media"
    start_urls = [sys.argv[1]]

    def parse(self, response):
        data = {"content": response.css("p::text").getall()}
        print(json.dumps(data))
