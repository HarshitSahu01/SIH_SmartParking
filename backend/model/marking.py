import cv2
import tkinter as tk
from tkinter import filedialog
import json
from PIL import Image, ImageTk

# Global variables
current_polygon = []  # Points of the polygon being drawn
areas = []  # List of all saved polygons
scaling_factor = 1  # To scale coordinates to the original dimensions

def mouse_click(event):
    """Add points to the polygon and display connecting lines."""
    global current_polygon, areas

    # Scale mouse coordinates to the original image dimensions
    scaled_x = int(event.x / scaling_factor)
    scaled_y = int(event.y / scaling_factor)
    
    if len(current_polygon) < 4:  # Allow up to 4 points
        current_polygon.append((scaled_x, scaled_y))
        canvas.create_oval(event.x - 2, event.y - 2, event.x + 2, event.y + 2, fill='red')

        # Draw permanent lines between points as they are added
        if len(current_polygon) > 1:
            canvas.create_line(
                int(current_polygon[-2][0] * scaling_factor),
                int(current_polygon[-2][1] * scaling_factor),
                int(current_polygon[-1][0] * scaling_factor),
                int(current_polygon[-1][1] * scaling_factor),
                fill='blue', width=2
            )

        # Complete polygon if it reaches 4 points
        if len(current_polygon) == 4:
            # Close the polygon by connecting the last point to the first
            canvas.create_line(
                int(current_polygon[-1][0] * scaling_factor),
                int(current_polygon[-1][1] * scaling_factor),
                int(current_polygon[0][0] * scaling_factor),
                int(current_polygon[0][1] * scaling_factor),
                fill='blue', width=2
            )
            canvas.create_polygon(
                [tuple(int(coord * scaling_factor) for coord in point) for point in current_polygon],
                outline='green', fill='', width=2
            )
            areas.append(current_polygon)  # Save the completed polygon
            current_polygon = []  # Reset for the next polygon

def save_to_file():
    """Save all marked polygons to a .txt file."""
    global areas
    file_path = filedialog.asksaveasfilename(defaultextension=".txt",
                                             filetypes=[("Text Files", "*.txt")])
    if file_path:
        with open(file_path, "w") as file:
            file.write(json.dumps(areas))
        print(f"File saved to {file_path}")

def load_video_frame(video_path):
    """Extract the first frame from the video."""
    cap = cv2.VideoCapture(video_path)
    ret, frame = cap.read()  # Read the first frame
    cap.release()  # Release the video file
    if ret:
        return frame
    else:
        raise ValueError("Unable to read the video file.")

# Initialize Tkinter window
root = tk.Tk()
root.title("Draw Quadrilaterals on Video Frame")

# Load the first frame from the video
video_path = "FinalParking/CameraFeed.mp4"  # Specify the path to your video
image_frame = load_video_frame(video_path)
original_height, original_width, _ = image_frame.shape

# Define canvas size with maximum width and height
max_canvas_width = 800
max_canvas_height = 600

# Calculate scaling factor to fit the image within the canvas while maintaining aspect ratio
scaling_factor = min(max_canvas_width / original_width, max_canvas_height / original_height)
scaled_width = int(original_width * scaling_factor)
scaled_height = int(original_height * scaling_factor)

# Create canvas with scaled dimensions
canvas = tk.Canvas(root, width=scaled_width, height=scaled_height, bg="white")
canvas.pack()

# Convert the first frame to a format suitable for Tkinter
frame_rgb = cv2.cvtColor(image_frame, cv2.COLOR_BGR2RGB)
frame_resized = cv2.resize(frame_rgb, (scaled_width, scaled_height), interpolation=cv2.INTER_AREA)
frame_pil = Image.fromarray(frame_resized)
frame_tk = ImageTk.PhotoImage(frame_pil)

# Display the first frame on the canvas
canvas.create_image(0, 0, anchor=tk.NW, image=frame_tk)
canvas.image = frame_tk

canvas.bind("<Button-1>", mouse_click)  # Left mouse button click to add points

btn_save_file = tk.Button(root, text="Save to File", command=save_to_file)
btn_save_file.pack()

btn_exit = tk.Button(root, text="Exit", command=root.quit)
btn_exit.pack()

root.mainloop()
