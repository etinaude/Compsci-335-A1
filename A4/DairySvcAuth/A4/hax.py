import requests 
URL = "localhost:8189/Service.svc/buy?id=248309245"
  
# location given here 
location = "delhi technological university"
  
# defining a params dict for the parameters to be sent to the API 
PARAMS = {'address':location} 
  
# sending get request and saving the response as response object 
r = requests.get(url = URL, params = "") 
#data = r.json() 
print(r)