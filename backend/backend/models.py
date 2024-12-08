from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class Users(AbstractUser):
    pass

class Parkings(models.Model):
    name = models.CharField(max_length=100)
    total_slots = models.IntegerField()
    address = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.IntegerField()
    lat = models.FloatField()
    long = models.FloatField()
    contact = models.CharField(max_length=20)
    owner_name = models.CharField(max_length=100)
    is_verified = models.BooleanField()
    is_smart = models.BooleanField()
    two_wheeler_price = models.FloatField()
    four_wheeler_price = models.FloatField()
    temp = models.IntegerField(default=0, null=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "total_slots": self.total_slots,
            "address": self.address,
            "city": self.city,
            "state": self.state,
            "pincode": self.pincode,
            "lat": self.lat,
            "long": self.long,
            "contact": self.contact,
            "owner_name": self.owner_name,
            "is_verified": self.is_verified,
            "is_smart": self.is_smart,
            "two_wheeler_price": self.two_wheeler_price,
            "four_wheeler_price": self.four_wheeler_price
        }

class Cameras(models.Model):
    parking_id = models.ForeignKey(Parkings, on_delete=models.CASCADE)
    camera_num = models.IntegerField()
    url = models.CharField(max_length=400)
    points = models.BinaryField()

'''

Users
id
password
username
email

Parkings
id
name
total_slots
address
city
state
pincode
lat 
long
contact
owner_name
is_verified
is_smart
two_wheeler_price
four_wheeler_price


Cameras
id
parking_id
camera_num
url
points blob

'''