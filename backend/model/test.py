import os
from Parking import detect_parking_spots   # Replace `your_script_name` with the name of your main script file (without .py)

def test_detect_parking_spots():
    # Define test inputs
    video_source = "FinalParking/parking1.mp4"  # Update to match the video file in your directory
    spots_file = "FinalParking/spots.txt"

    # Check if files exist
    assert os.path.exists(video_source), f"Video source file not found: {video_source}"
    assert os.path.exists(spots_file), f"Spots file not found: {spots_file}"

    # Call the function with test inputs
    try:
        empty_spots = detect_parking_spots(video_source, spots_file, display_window=False)
        print(f"Test Passed: Detected {empty_spots} empty parking spots.")
    except Exception as e:
        print(f"Test Failed: {e}")

if __name__ == "__main__":
    test_detect_parking_spots()
