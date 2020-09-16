import requests 
from requests.auth import HTTPBasicAuth
URL = "http://jbon007:jbon007passwd@localhost:8189/Service.svc/buy?id=248309246"
  
# location given here 
location = "delhi technological university"
  
# defining a params dict for the parameters to be sent to the API 
PARAMS = {'address':location} 
  
# sending get request and saving the response as response object 
#r = requests.get(url = URL, auth=HTTPBasicAuth("jbon007","jbon007passwd")) 
r = requests.get(url = URL) 
#data = r.json() 
print(r)
