import base64
from django.contrib.staticfiles import finders
from django.http import HttpResponseForbidden
from functools import wraps
from backend.models import *
import os 

def image_to_base64(image_path):
    path = 'static/'+image_path
    print(path)
    with open(path, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode('utf-8')

def is_parking_owner(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        parking_id = kwargs.get('parking_id')
        try:
            parking = Parking.objects.get(id=parking_id)
        except Parking.DoesNotExist:
            return HttpResponseForbidden("Parking spot not found")
        
        if parking.owner.user != request.user:
            return HttpResponseForbidden("You are not the owner of this parking spot")
        
        return view_func(request, *args, **kwargs)

    return _wrapped_view

def require_parking_owner(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return HttpResponseForbidden("You need to be logged in")
        
        if not ParkingOwner.objects.filter(user=request.user).exists():
            return HttpResponseForbidden("You are not a registered parking owner")
        
        return view_func(request, *args, **kwargs)

    return _wrapped_view
