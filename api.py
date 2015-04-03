import json
import MySQLdb
import requests
from riotwatcher import RiotWatcher

from config import *

#with open('key.txt', 'r') as f:
#  KEY = f.read().strip()

GLOBAL_ENDPOINT = "https://global.api.pvp.net/api/lol/static-data/{0}/"
REGIONAL_ENDPOINT = "https://{0}.api.pvp.net/api/lol/{0}/"

def get_champions(region, freetoplay="false"):
  return requests.get(
      (REGIONAL_ENDPOINT + "v1.2/champion?freeToPlay={1}&api_key={2}")
          .format(region, freetoplay, KEY), verify=VERIFY_CERTS)

if __name__ == "__main__":
  # Put stuff here to test.
  w = RiotWatcher(KEY)

  # check if we have API calls remaining
  print w.can_make_request()

  summoner = w.get_summoner(name='KirkBerkley')
  print(summoner)

  db = MySQLdb.connect(host=SQL_HOST,
                       port=SQL_PORT,
                       user=SQL_USER,
                       passwd=SQL_PASS,
                       db=SQL_DB)
  cur = db.cursor() 
  cur.execute("""INSERT INTO summoner (id, name, profileIconId, revisionDate, summonerLevel)
                 VALUES ('{0}', '{1}', '{2}', '{3}', '{4}');""".format(summoner['id'], summoner['name'], summoner['profileIconId'], summoner['revisionDate'], summoner['summonerLevel']))
  db.commit()
  pass
