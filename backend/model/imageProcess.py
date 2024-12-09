import cv2
import pandas as pd
import numpy as np
from ultralytics import YOLO
import ast
import pickle

# Load the YOLO model once
model = YOLO('yolov8s.pt')

# def detect_parking_spots_from_image(image_path, car_spots_file, bike_spots_file, class_file='coco.txt'):
def detect_parking_spots_from_image(image_path, spots_binary, class_file='coco.txt', window=False):
    """
    Detects empty car and motorcycle parking spots from an image and displays the result.

    Args:
        image_path (str): Path to the input image file.
        car_spots_file (str): Path to the file containing car parking area coordinates.
        bike_spots_file (str): Path to the file containing motorcycle parking area coordinates.
        class_file (str): Path to the file containing class names (default: 'FinalParking/coco.txt').

    Returns:
        tuple: Number of empty car parking spots and empty motorcycle parking spots.
    """
    # Load class list
    with open(class_file, "r") as file:
        class_list = file.read().split("\n")

    # Load car and motorcycle parking areas
    # with open(car_spots_file, "r") as file:
    #     car_parking_areas = ast.literal_eval(file.read())
    # with open(bike_spots_file, "r") as file:
    #     bike_parking_areas = ast.literal_eval(file.read())
    
    car_parking_areas = spots['car']
    bike_parking_areas = spots['bike']

    # Read and resize the input image
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError("Unable to read the image file.")

    original_height, original_width, _ = image.shape
    resized_width, resized_height = 1020, 500
    scaling_factor_x = resized_width / original_width
    scaling_factor_y = resized_height / original_height

    image = cv2.resize(image, (resized_width, resized_height))

    # Scale parking areas
    scaled_car_areas = [
        [(int(x * scaling_factor_x), int(y * scaling_factor_y)) for x, y in area]
        for area in car_parking_areas
    ]
    scaled_bike_areas = [
        [(int(x * scaling_factor_x), int(y * scaling_factor_y)) for x, y in area]
        for area in bike_parking_areas
    ]

    # Run model predictions on the image
    results = model.predict(image, verbose=False)
    predictions = pd.DataFrame(results[0].boxes.data).astype("float")

    # Initialize occupied flags
    occupied_cars = [0] * len(scaled_car_areas)
    occupied_bikes = [0] * len(scaled_bike_areas)

    # Process detections for cars and motorcycles
    if window:
        for _, row in predictions.iterrows():
            x1, y1, x2, y2, _, class_id = map(int, row[:6])
            class_name = class_list[class_id]
            cx, cy = (x1 + x2) // 2, (y1 + y2) // 2

            # Check for cars
            if "car" in class_name:
                for idx, area in enumerate(scaled_car_areas):
                    if cv2.pointPolygonTest(np.array(area, np.int32), (cx, cy), False) >= 0:
                        occupied_cars[idx] += 1

            # Check for motorcycles
            if "motorcycle" in class_name or "motorbike" in class_name:
                for idx, area in enumerate(scaled_bike_areas):
                    if cv2.pointPolygonTest(np.array(area, np.int32), (cx, cy), False) >= 0:
                        occupied_bikes[idx] += 1

        # Calculate free spaces
        free_cars = sum(1 for occupied in occupied_cars if occupied == 0)
        free_bikes = sum(1 for occupied in occupied_bikes if occupied == 0)

        # Render image with markings
        for idx, area in enumerate(scaled_car_areas):
            color = (0, 0, 255) if occupied_cars[idx] else (0, 255, 0)
            cv2.polylines(image, [np.array(area, np.int32)], True, color, 2)
            cv2.putText(image, f"C{idx + 1}", tuple(area[0]), cv2.FONT_HERSHEY_COMPLEX, 0.5, color, 1)

        for idx, area in enumerate(scaled_bike_areas):
            color = (255, 0, 0) if occupied_bikes[idx] else (0, 255, 0)
            cv2.polylines(image, [np.array(area, np.int32)], True, color, 2)
            cv2.putText(image, f"B{idx + 1}", tuple(area[0]), cv2.FONT_HERSHEY_COMPLEX, 0.5, color, 1)

        cv2.putText(image, f"Free Cars: {free_cars}, Free Bikes: {free_bikes}", (23, 30),
                    cv2.FONT_HERSHEY_PLAIN, 2, (255, 255, 255), 2)

        # Display the output image
        cv2.imshow("Detected Parking Spots", image)
        cv2.waitKey(0)
        cv2.destroyAllWindows()

    return free_cars, free_bikes

import json 

# Example usage
if __name__ == "__main__":
    image_path = 'image.png'  # Input image file
    # car_spots_file = 'cars.txt'  # Car parking areas file
    # bike_spots_file = 'image.txt'  # Motorcycle parking areas file 

    spots = {
        'car':[],
        'bike':[[[349, 249], [365, 169], [296, 173], [283, 246]], [[555, 245], [551, 157], [615, 153], [623, 249]], [[417, 249], [429, 158], [367, 153], [349, 261]], [[640, 687], [638, 534], [726, 535], [740, 682]], [[108, 678], [142, 540], [226, 538], [194, 678]], [[8, 676], [34, 517], [129, 527], [100, 684]]]
    }

    try:
        # empty_cars, empty_bikes = detect_parking_spots_from_image(image_path, car_spots_file, bike_spots_file)
        empty_cars, empty_bikes = detect_parking_spots_from_image(image_path, spots, window=True)
        print(f"Free car spots: {empty_cars}, Free bike spots: {empty_bikes}")
    except ValueError as e:
        print(f"Error: {e}")