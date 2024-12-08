import base64
from django.contrib.staticfiles import finders
import os 

def image_to_base64(image_path):
    # print(os.getcwd())
    # absolute_image_path = finders.find(image_path)
    
    # if not absolute_image_path:
    #     raise FileNotFoundError(f"Image {image_path} not found.")
    
    path = 'static/'+image_path
    print(path)
    with open(path, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode('utf-8')
