import json
import requests

KEY = ''

with open('key.txt', 'r') as f:
  KEY = f.read().strip()

GLOBAL_ENDPOINT = "https://global.api.pvp.net/api/lol/static-data/{0}"
REGIONAL_ENDPOINT = "https://{0}.api.pvp.net/api/lol/{0}/"

def get_champions(region, freetoplay="false"):
  return requests.get(
      (REGIONAL_ENDPOINT + "v1.2/champion?freeToPlay={1}&api_key={2}")
          .format(region, freetoplay, KEY), verify=False)

if __name__ == "__main__":
  # Put stuff here to test.
  pass
