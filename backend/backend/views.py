import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.http import HttpResponse
from backend.models import *
from geopy.distance import geodesic

# print('Loading model')
# from model.imageProcess import detect_parking_spots_from_image
# # def detect_parking_spots_from_image(*args, **kwargs):
# #     pass
# print('Model loaded')

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


def testView(request):
    
    image_path = 'model/image.png'  # Input image file
    # car_spots_file = 'model/cars.txt'  # Car parking areas file
    # bike_spots_file = 'model/image.txt'  # Motorcycle parking areas file

    spots = Cameras.objects.get(id=1).points

    try:
        # empty_cars, empty_bikes = detect_parking_spots_from_image(image_path, car_spots_file, bike_spots_file, 'model/coco.txt')
        empty_cars, empty_bikes = detect_parking_spots_from_image(image_path, spots, 'model/coco.txt')
        print(f"Free car spots: {empty_cars}, Free bike spots: {empty_bikes}")
    except ValueError as e:
        print(f"Error: {e}")
    return JsonResponse({'message': 'Image processed!','empty_cars':empty_cars, 'empty_bikes':empty_bikes})

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