import cv2
import pandas as pd
import numpy as np
from ultralytics import YOLO
import ast

def detect_parking_spots(video_source, spots_file, model_path='FinalParking/yolov8s.pt', class_file='coco.txt', display_window=True):
    """
    Detects empty parking spots from a video source or camera.

    Args:
        video_source (str or int): Path to the video file or camera index.
        spots_file (str): Path to the spots.txt file containing parking area coordinates.
        model_path (str): Path to the YOLO model file (default: 'FinalParking/yolov8s.pt').
        class_file (str): Path to the file containing class names (default: 'FinalParking/coco.txt').
        display_window (bool): If True, displays the video feed with parking spot statuses.

    Returns:
        int: Number of empty parking spots detected.
    """
    # Load YOLO model and class list
    model = YOLO(model_path)
    with open(class_file, "r") as file:
        class_list = file.read().split("\n")

    # Load parking areas
    with open(spots_file, "r") as file:
        parking_areas = ast.literal_eval(file.read())

    # Open video source
    cap = cv2.VideoCapture(video_source)
    ret, original_frame = cap.read()
    if not ret:
        raise ValueError("Unable to read video source.")

    # Get original and resized frame dimensions
    original_height, original_width, _ = original_frame.shape
    resized_width, resized_height = 1020, 500
    scaling_factor_x = resized_width / original_width
    scaling_factor_y = resized_height / original_height

    # Scale parking areas
    scaled_areas = [
        [(int(x * scaling_factor_x), int(y * scaling_factor_y)) for x, y in area]
        for area in parking_areas
    ]

    frame_skip = 4  # Process every 5th frame
    frame_count = 0
    free_spaces = len(scaled_areas)  # Start with all spaces assumed free

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        if frame_count % frame_skip != 0:
            continue  # Skip frames for faster processing

        # Resize the frame
        frame = cv2.resize(frame, (resized_width, resized_height))
        results = model.predict(frame, verbose=False)
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

        # Optionally display the window
        if display_window:
            for idx, area in enumerate(scaled_areas):
                color = (0, 0, 255) if occupied[idx] else (0, 255, 0)
                cv2.polylines(frame, [np.array(area, np.int32)], True, color, 2)
                cv2.putText(frame, str(idx + 1), tuple(area[0]), cv2.FONT_HERSHEY_COMPLEX, 0.5, color, 1)

            cv2.putText(frame, f"Free Spaces: {free_spaces}", (23, 30), cv2.FONT_HERSHEY_PLAIN, 3, (255, 255, 255), 2)
            cv2.imshow("Parking Detection", frame)

            if cv2.waitKey(1) & 0xFF == 27:
                break

    cap.release()
    if display_window:
        cv2.destroyAllWindows()

    return free_spaces


if __name__ == "__main__":
    video_source = 'CameraFeed.mp4'
    spots_file = 'sample.txt'
    empty_spots = detect_parking_spots(video_source, spots_file)
    print(f"Number of empty parking spots: {empty_spots}")
