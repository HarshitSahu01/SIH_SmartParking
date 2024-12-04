import cv2
import pandas as pd
import numpy as np
from ultralytics import YOLO
import ast
import pickle

# Load the YOLO model once
model = YOLO('yolov8s.pt')


def detect_parking_spots_from_image(image_path, spots_binary, class_file='coco.txt'):
    """
    Detects empty parking spots from an image and displays the result.

    Args:
        image_path (str): Path to the input image file.
        spots_file (str): Path to the spots.txt file containing parking area coordinates.
        class_file (str): Path to the file containing class names (default: 'FinalParking/coco.txt').

    Returns:
        int: Number of empty parking spots detected.
    """
    # Load class list
    with open(class_file, "r") as file:
        class_list = file.read().split("\n")

    # # Load parking areas
    # with open(spots_file, "r") as file:
    #     parking_areas = ast.literal_eval(file.read())
    
    parking_areas = pickle.loads(spots_binary)

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
    scaled_areas = [
        [(int(x * scaling_factor_x), int(y * scaling_factor_y)) for x, y in area]
        for area in parking_areas
    ]

    # Run model predictions on the image
    results = model.predict(image, verbose=False)
    predictions = pd.DataFrame(results[0].boxes.data).astype("float")

    # Check for occupied areas
    occupied = [0] * len(scaled_areas)
    for _, row in predictions.iterrows():
        x1, y1, x2, y2, _, class_id = map(int, row[:6])
        class_name = class_list[class_id]

        if "car" in class_name:
            cx, cy = (x1 + x2) // 2, (y1 + y2) // 2
            for idx, area in enumerate(scaled_areas):
                if cv2.pointPolygonTest(np.array(area, np.int32), (cx, cy), False) >= 0:
                    occupied[idx] += 1

    # Calculate free spaces
    free_spaces = len(scaled_areas) - sum(occupied)

    # Render image with markings
    for idx, area in enumerate(scaled_areas):
        color = (0, 0, 255) if occupied[idx] else (0, 255, 0)
        cv2.polylines(image, [np.array(area, np.int32)], True, color, 2)
        cv2.putText(image, str(idx + 1), tuple(area[0]), cv2.FONT_HERSHEY_COMPLEX, 0.5, color, 1)

    cv2.putText(image, f"Free Spaces: {free_spaces}", (23, 30), cv2.FONT_HERSHEY_PLAIN, 2, (255, 255, 255), 2)

    # Display the output image
    cv2.imshow("Detected Parking Spots", image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

    return free_spaces


# Example usage
if __name__ == "__main__":
    image_path = 'ParkingLot.jpg'  # Input image file
    points = [[[328, 496], [430, 488], [465, 537], [352, 547]], [[432, 488], [529, 475], [571, 536], [464, 544]], [[528, 483], [617, 481], [678, 526], [577, 537]], [[620, 488], [729, 465], [782, 510], [686, 534]], [[123, 505], [232, 505], [236, 558], [120, 555]], [[230, 468], [233, 504], [131, 502], [142, 465]], [[235, 496], [331, 489], [348, 534], [241, 560]], [[324, 456], [400, 440], [419, 473], [334, 488]], [[568, 448], [611, 478], [537, 484], [488, 446]], [[625, 478], [718, 454], [662, 411], [579, 438]], [[955, 462], [1067, 433], [1115, 473], [1059, 494]]]
    spots_file = pickle.dumps(points)

    try:
        empty_spots = detect_parking_spots_from_image(image_path, spots_file)
        print(f"Number of empty parking spots: {empty_spots}")
    except ValueError as e:
        print(f"Error: {e}")
