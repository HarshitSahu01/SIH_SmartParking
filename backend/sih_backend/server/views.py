import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.http import HttpResponse
from server.models import *
from geopy.distance import geodesic

RADIUS = 2000 # in metres

def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")

# Create your views here.
@csrf_exempt
def searchParkings(request):
    data = json.loads(request.body)
    print(request.body)
    # print(dict(data))
    lat = float(data.get('lat'))
    long = float(data.get('long'))
    city = data['city'].strip().title()
    state = data['state'].strip().title()

    parkings = Parkings.objects.filter(city=city, state=state)

    filtered_parkings = []
    for parking in parkings:
        parking_coords = (parking.lat, parking.long)
        user_coords = (lat, long)
        distance = geodesic(parking_coords, user_coords).meters

        if distance <= RADIUS:
            filtered_parkings.append(parking)

    return JsonResponse({"parkings": [parking.serialize() for parking in filtered_parkings]})

def getCords(request):
    data = []
    for parking in Parkings.objects.all():
        data.append({
            'properties': {
                'name': parking.name,
                'address': parking.address,
                'phone': parking.contact,
            },
            'geometry': {
                'coordinates': [parking.lat, parking.long],
            }
        })
    return JsonResponse({'data': data})

'''

create view using post and csrf_exempt
input will be lat and long city state in json format
filter the parkings based on the state and city
find the parkings in RADIUS distance from the user
return the parkings in json format
create a dictionary with parkings attribute 
it should have a list
use Parkings.serialize() method to get json data



'''