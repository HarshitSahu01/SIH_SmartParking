import cv2
import pandas as pd
import numpy as np
from ultralytics import YOLO
import json

# Load the YOLO model once
model = YOLO('yolov8s.pt')

def detect_parking_spots_from_image(image_path, spots_binary, class_file='coco.txt', window=False):
    """
    Detects empty car and motorcycle parking spots from an image and displays the result.

    Args:
        image_path (str): Path to the input image file.
        spots_binary (dict): Binary data containing parking spot coordinates for cars and bikes.
        class_file (str): Path to the file containing class names (default: 'coco.txt').
        window (bool): Whether to display the output image.

    Returns:
        tuple: Number of empty car parking spots and empty motorcycle parking spots.
    """
    # Load class list
    with open(class_file, "r") as file:
        class_list = file.read().split("\n")

    # Extract parking areas from binary data
    car_parking_areas = spots_binary['car_spots']
    bike_parking_areas = spots_binary['bike_spots']

    # Read the input image
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError("Unable to read the image file.")

    # Run model predictions on the image
    results = model.predict(image, verbose=False)
    predictions = pd.DataFrame(results[0].boxes.data).astype("float")

    # Initialize occupied flags
    occupied_cars = [0] * len(car_parking_areas)
    occupied_bikes = [0] * len(bike_parking_areas)

    # Process detections for cars and motorcycles
    for _, row in predictions.iterrows():
        x1, y1, x2, y2, _, class_id = map(int, row[:6])
        class_name = class_list[class_id]
        cx, cy = (x1 + x2) // 2, (y1 + y2) // 2

        # Check for cars
        if "car" in class_name:
            for idx, area in enumerate(car_parking_areas):
                if cv2.pointPolygonTest(np.array(area, np.int32), (cx, cy), False) >= 0:
                    occupied_cars[idx] += 1

        # Check for motorcycles
        if "motorcycle" in class_name or "motorbike" in class_name:
            for idx, area in enumerate(bike_parking_areas):
                if cv2.pointPolygonTest(np.array(area, np.int32), (cx, cy), False) >= 0:
                    occupied_bikes[idx] += 1

    # Calculate free spaces
    free_cars = sum(1 for occupied in occupied_cars if occupied == 0)
    free_bikes = sum(1 for occupied in occupied_bikes if occupied == 0)

    # Optionally render image with markings
    if window:
        for idx, area in enumerate(car_parking_areas):
            color = (0, 0, 255) if occupied_cars[idx] else (0, 255, 0)
            cv2.polylines(image, [np.array(area, np.int32)], True, color, 2)
            cv2.putText(image, f"C{idx + 1}", (int(area[0][0]), int(area[0][1])), cv2.FONT_HERSHEY_COMPLEX, 0.5, color, 1)

        for idx, area in enumerate(bike_parking_areas):
            color = (255, 0, 0) if occupied_bikes[idx] else (0, 255, 0)
            cv2.polylines(image, [np.array(area, np.int32)], True, color, 2)
            cv2.putText(image, f"B{idx + 1}", (int(area[0][0]), int(area[0][1])), cv2.FONT_HERSHEY_COMPLEX, 0.5, color, 1)

        cv2.putText(image, f"Free Cars: {free_cars}, Free Bikes: {free_bikes}", (23, 30),
                    cv2.FONT_HERSHEY_PLAIN, 2, (255, 255, 255), 2)

        # Display the output image
        cv2.imshow("Detected Parking Spots", image)
        cv2.waitKey(0)
        cv2.destroyAllWindows()

    return free_cars, free_bikes

# Example usage
if __name__ == "__main__":
    image_path = '../../backend/static/sampleParking1.png'  # Input image file
    spots = {
        "car_spots": [[[204.285, 205.998], [304.6536018676758, 209.334], [300.98160186767575, 328.596], [205.50960186767577, 323.592]]],
        "bike_spots": [[[384.2136018676758, 208.5], [476.0136018676758, 206.832], [476.0136018676758, 322.758], [381.7656018676758, 324.426]]]
    }
    try:
        empty_cars, empty_bikes = detect_parking_spots_from_image(image_path, spots, window=True)
        print(f"Free car spots: {empty_cars}, Free bike spots: {empty_bikes}")
    except ValueError as e:
        print(f"Error: {e}")
