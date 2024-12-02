import cv2
import os

def extract_frame_from_video(video_path, time_in_seconds, output_image_name=None):
    """
    Extracts a specific frame from a video file based on the given time.

    Args:
        video_path (str): Path to the video file.
        time_in_seconds (float): Time (in seconds) at which the frame should be extracted.
        output_image_name (str, optional): Name of the output image file. If None, defaults to the video name with '.jpg'.
    
    Returns:
        str: Path to the saved image file.
    """
    # Open the video file
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError("Unable to open video file.")

    # Calculate the frame number based on the time
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_number = int(time_in_seconds * fps)

    # Set the video to the specific frame
    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_number)
    ret, frame = cap.read()
    if not ret:
        cap.release()
        raise ValueError("Unable to read frame at the specified time.")

    # Generate output image file name
    if output_image_name is None:
        base_name = os.path.splitext(os.path.basename(video_path))[0]
        output_image_name = f"{base_name}_frame_at_{time_in_seconds}s.jpg"
    
    output_image_path = os.path.join(os.path.dirname(video_path), output_image_name)

    # Save the frame as an image
    cv2.imwrite(output_image_path, frame)
    cap.release()

    return output_image_path

def main():
    print("Video Frame Extractor")
    video_file = input("Enter the path to the video file: ").strip()
    time_to_extract = float(input("Enter the time (in seconds) to extract the frame: ").strip())

    try:
        saved_image_path = extract_frame_from_video(video_file, time_to_extract)
        print(f"Frame saved as: {saved_image_path}")
    except ValueError as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
