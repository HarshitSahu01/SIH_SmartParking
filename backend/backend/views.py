import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.http import HttpResponse, JsonResponse
from backend.models import *
from geopy.distance import geodesic
from backend.utils import *
from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import ObjectDoesNotExist
import base64
import json

print('Loading model')
# # from model.imageProcess import detect_parking_spots_from_image
def detect_parking_spots_from_image(*args, **kwargs):
    pass
# # print('Model loaded')

RADIUS = 10000 # in metres

def getSampleImages(request):
    try:
        # Replace these with your actual image paths
        image_paths = ['sampleParking1.png', 'sampleParking2.png', 'sampleParking3.png']
        encoded_images = [image_to_base64(image) for image in image_paths]
        
        response = {
            'message': 'success',
            'images': encoded_images
        }
        return JsonResponse(response)
    except Exception as e:
        return JsonResponse({'message': 'error', 'error': str(e)})

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

    parkings = Parking.objects.filter(city=city, state=state)

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
    for parking in Parking.objects.all():
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

    spots = Camera.objects.get(id=1).points

    try:
        # empty_cars, empty_bikes = detect_parking_spots_from_image(image_path, car_spots_file, bike_spots_file, 'model/coco.txt')
        empty_cars, empty_bikes = detect_parking_spots_from_image(image_path, spots, 'model/coco.txt')
        print(f"Free car spots: {empty_cars}, Free bike spots: {empty_bikes}")
    except ValueError as e:
        print(f"Error: {e}")
    return JsonResponse({'message': 'Image processed!','empty_cars':empty_cars, 'empty_bikes':empty_bikes})

def ping(request):
    return JsonResponse({'message': 'pong', 'id':request.user.id})


# Helper function for validating fields
def validate_fields(data, required_fields):
    for field in required_fields:
        if field not in data or data[field] == '':
            return False
    return True

# /getParkings
@csrf_exempt
def get_parkings(request):
    lat = request.GET.get('lat')
    long = request.GET.get('long')
    city = request.GET.get('city')
    state = request.GET.get('state')
    
    if lat is None or long is None:
        return JsonResponse({'message': 'Invalid request: lat and long are required'}, status=400)

    # Query logic (you should ideally filter by proximity to lat/long)
    parkings = Parking.objects.filter(city=city, state=state)

    filtered_parkings = []
    for parking in parkings:
        parking_coords = (parking.lat, parking.long)
        user_coords = (lat, long)
        distance = geodesic(parking_coords, user_coords).meters

        if distance <= RADIUS:
            filtered_parkings.append({
                'id': parking.id,
                'name': parking.name,
                'two_wheeler_price': parking.two_wheeler_price,
                'four_wheeler_price': parking.four_wheeler_price,
                'lat': parking.lat,
                'long': parking.long,
                'car_spots': 1,
                'bike_spots': 1,
                'distance': distance,
                'time': '{:0.2f} min'.format(round(distance / 500)),
                'address': f'{parking.address}, {parking.city}, {parking.state}',
                'image': parking.image.url
            })

    return JsonResponse({'message': 'Success', 'parkings': filtered_parkings}, status=200)


# /getParkingData
@csrf_exempt
def getParkingData(request):
    parking_id = request.GET.get('id')
    lat = request.GET.get('lat')
    long = request.GET.get('long')
    user_coords = (lat, long)
    parking_coords = (Parking.objects.get(id=parking_id).lat, Parking.objects.get(id=parking_id).long)

    try:
        parking = Parking.objects.get(id=parking_id)
        distance = geodesic(parking_coords, user_coords).meters
        parking_data = {
                'id': parking.id,
                'name': parking.name,
                'two_wheeler_price': parking.two_wheeler_price,
                'four_wheeler_price': parking.four_wheeler_price,
                'lat': parking.lat,
                'long': parking.long,
                'distance': distance,
                'car_spots': 1,
                'bike_spots': 1,
                'time': '{:0.2f} min'.format(round(distance / 500)),
                'address': f'{parking.address}, {parking.city}, {parking.state}',
                'image': parking.image.url
            }
        return JsonResponse({'message': 'Success', 'parkings': parking_data}, status=200)
    except ObjectDoesNotExist:
        return JsonResponse({'message': 'Parking not found'}, status=404)


# /login
def login_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON data'}, status=400)

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return JsonResponse({'message': 'Username and password are required'}, status=400)

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'message': 'success'}, status=200)
        else:
            return JsonResponse({'message': 'Invalid username or password'}, status=400)

    return JsonResponse({'message': 'Invalid request method'}, status=405)


# /register
@csrf_exempt
def register_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        required_fields = ['username', 'email', 'password', 'contact', 'organization']

        # print(request.body)
        if not validate_fields(data, required_fields):
            return JsonResponse({'message': 'Invalid data'}, status=400)
        # print('here')
        print(data.get('username'))
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        contact = data.get('contact')
        organization = data.get('organization')

        if username == '' or email == '' or password == '':
            return JsonResponse({'message': 'Invalid data'}, status=400)

        if Users.objects.filter(email=email).exists():
            return JsonResponse({'message': 'Email already taken'}, status=400)

        if Users.objects.filter(username=username).exists():
            return JsonResponse({'message': 'Username already taken'}, status=400)

        user = Users.objects.create_user(username=username, email=email, password=password)
        user.save()
        login(request, user)
        parking_owner = ParkingOwner.objects.create(user=user, contact=contact, organization=organization)
        parking_owner.save()
        
        return JsonResponse({'message': 'success'}, status=200)
    return JsonResponse({'message': 'Invalid request method'}, status=405)

def logout_view(request):
    if request.method == "POST":
        logout(request) 
        return JsonResponse({'message': 'success'}, status=200)
    return JsonResponse({'message': 'Invalid request method'}, status=405)

def isAuthenticated(request):
    if request.user.is_authenticated:
        return JsonResponse({'message': 'success'}, status=200)
    return JsonResponse({'message': 'failure'}, status=400)

# /createParking
@csrf_exempt
def create_parking(request):
    if request.method == "POST":
        data = request.POST
        required_fields = ['name', 'address', 'city', 'district', 'state', 'pincode', 'is_smart', 'two_wheeler_price', 'four_wheeler_price']

        if not validate_fields(data, required_fields):
            return JsonResponse({'message': 'Invalid data'}, status=400)

        parking = Parking.objects.create(
            owner=ParkingOwner.objects.get(user=request.user),
            name=data.get('name'),
            address=data.get('address'),
            city=data.get('city'),
            state=data.get('state'),
            pincode=data.get('pincode'),
            is_smart=data.get('is_smart') == 'True',
            two_wheeler_price=float(data.get('two_wheeler_price')),
            four_wheeler_price=float(data.get('four_wheeler_price'))
        )
        
        return JsonResponse({'message': 'success'}, status=200)
    return JsonResponse({'message': 'Invalid request method'}, status=405)


# /fetchParkingImage
@csrf_exempt
def fetch_parking_image(request):
    if request.method == "POST":
        data = request.POST

        parking_id = data.get('parking_id')
        try:
            cameras = Camera.objects.filter(parking_id=parking_id)
            images = [{
                "camera_id": cam.id,
                "image": base64.b64encode(cam.image).decode('utf-8') if cam.image else None  # Assuming cam.image holds binary image data
            } for cam in cameras]

            return JsonResponse({'message': 'success', 'images': images}, status=200)
        except ObjectDoesNotExist:
            return JsonResponse({'message': 'Parking not found'}, status=404)

    return JsonResponse({'message': 'Invalid request method'}, status=405)


# /createParkingSpots
@csrf_exempt
def create_parking_spots(request):
    if request.method == "POST":
        data = json.loads(request.body)

        for spot_data in data:
            try:
                camera = Camera.objects.get(id=spot_data['camera_id'])
                camera.car_spots = spot_data.get('car_spots', [])
                camera.bike_spots = spot_data.get('bike_spots', [])
                camera.save()
            except ObjectDoesNotExist:
                return JsonResponse({'message': 'Invalid camera ID'}, status=404)

        return JsonResponse({'message': 'success'}, status=200)
    
    return JsonResponse({'message': 'Invalid request method'}, status=405)



    try:
        # Create a PaymentIntent with the order amount and currency
        intent = stripe.PaymentIntent.create(
            amount=5000,  # Amount in cents (e.g., $50.00)
            currency='usd',
            automatic_payment_methods={
                'enabled': True,
            },
        )
        return JsonResponse({'clientSecret': intent['client_secret']})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)