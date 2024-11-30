from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.http import HttpResponse
from server.models import *
from geopy.distance import geodesic

RADIUS = 10000 # in metres

def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")

# Create your views here.
@require_POST
def searchParkings(request):
    data = request.POST
    lat = float(data['lat'])
    long = float(data['long'])
    city = data['city'].lower().strip()
    state = data['state'].lower().strip()

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
    cords = []
    for parking in Parkings.objects.all():
        cords.append({"lat": parking.lat, "long": parking.long})
    return JsonResponse({'cords': cords})

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