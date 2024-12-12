from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
# Create your models here.
class Users(AbstractUser):
    is_parking_owner = models.BooleanField(default=False)
    contact = models.CharField(max_length=20, default='')

class ParkingOwner(models.Model):
    user = models.ForeignKey('Users', on_delete=models.CASCADE, null=True, blank=True)
    contact = models.CharField(max_length=20)
    organization = models.CharField(max_length=100)

class Parking(models.Model):
    owner = models.ForeignKey(ParkingOwner, on_delete=models.CASCADE)  
    name = models.CharField(max_length=100, null=True)
    total_slots = models.PositiveIntegerField(null=True)
    address = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)  
    lat = models.FloatField()
    long = models.FloatField()
    contact = models.CharField(max_length=20)
    is_verified = models.BooleanField(default=False) 
    is_smart = models.BooleanField(default=False)
    two_wheeler_price = models.DecimalField(max_digits=6, decimal_places=2) 
    four_wheeler_price = models.DecimalField(max_digits=6, decimal_places=2)
    image = models.ImageField(upload_to='parking_images/', null=True, blank=True)
    is_logistic = models.BooleanField(default=False)

class Camera(models.Model):
    parking = models.ForeignKey(Parking, on_delete=models.CASCADE)
    camera_num = models.PositiveIntegerField()
    url = models.URLField(max_length=400)
    spots = models.JSONField(null=True)

class Booking(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    parking = models.ForeignKey(Parking, on_delete=models.CASCADE)
    vehicle_num = models.CharField(max_length=20)
    checkin_time = models.DateTimeField()
    checkout_time = models.DateTimeField()
    slot_timing = models.DateTimeField(null=True)
    is_checked_out = models.BooleanField(default=False)
    amount = models.DecimalField(max_digits=6, decimal_places=2)
    is_paid = models.BooleanField(default=False)
    status = models.CharField(max_length=20, default='pending')    # pending, confirmed, cancelled, completed

    def serialize(self):
        return {
            'id': self.id,
            'user': self.user.username,
            'parking': self.parking.name,
            'vehicle_num': self.vehicle_num,
            'checkin_time': self.checkin_time,
            'checkout_time': self.checkout_time,
            'slot_timing': self.slot_timing,
            'is_checked_out': self.is_checked_out,
            'amount': self.amount,
            'is_paid': self.is_paid,
            'status': self.status
        }