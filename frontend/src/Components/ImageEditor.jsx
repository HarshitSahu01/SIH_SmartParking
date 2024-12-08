import React, { useRef, useState, useEffect } from 'react';

export default function ImageEditor() {
    const canvasRef = useRef(null);
    const [canvasImages, setCanvasImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0, factor: 0, requiredHeight: 500 });
    const [drawMode, setDrawMode] = useState(1); // Default to draw mode 1 (marking points)
    const [currentPoints, setCurrentPoints] = useState([]);
    const [spots, setSpots] = useState([]); // State to store spots for car and bike spots

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch('http://localhost:5000/getSampleImages');
                const data = await response.json();

                const loadedImages = await Promise.all(
                    data.images.map((imageData) => {
                        return new Promise((resolve) => {
                            const img = new Image();
                            img.src = `data:image/jpeg;base64,${imageData}`;
                            img.onload = () => resolve(img);
                        });
                    })
                );
                setCanvasImages(loadedImages);
                setSpots(new Array(loadedImages.length).fill({ car_spots: [], bike_spots: [] })); // Initialize spots for each image
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
    }, []);

    useEffect(() => {
        if (canvasImages.length > 0) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            const currentImage = canvasImages[currentImageIndex];
            canvas.height = imageDimensions.requiredHeight;
            canvas.width = currentImage.width * (imageDimensions.requiredHeight / currentImage.height);

            // Redraw the current image every time the canvas size or image changes
            ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);

            // Draw already marked spots (existing quadrilaterals)
            spots[currentImageIndex]?.car_spots.forEach((spot, index) => {
                drawRectangle(ctx, spot, index + 1); // Pass the index (starting from 1) to display square number
            });
        }
    }, [canvasImages, currentImageIndex, spots]); // Re-run drawing whenever images, current image, or spots change

    const handleCanvasClick = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (drawMode === 1) {
            setCurrentPoints((prevPoints) => {
                const newPoints = [...prevPoints, [x, y]]; // Store points as lists [x, y]
                draw(newPoints);
                return newPoints;
            });
        }
    };

    const draw = (newPoints) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const currentImage = canvasImages[currentImageIndex];

        // Draw the image and all the spots without clearing the canvas
        // ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);

        // Draw points and lines for the current rectangle
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;

        newPoints.forEach((point, index) => {
            ctx.beginPath();
            ctx.arc(point[0], point[1], 5, 0, Math.PI * 2); // Draw points
            ctx.fill();

            if (index > 0) {
                ctx.beginPath();
                ctx.moveTo(newPoints[index - 1][0], newPoints[index - 1][1]);
                ctx.lineTo(point[0], point[1]); // Draw lines between points
                ctx.stroke();
            }
        });

        // If 4 points are selected, draw a rectangle and add to spots
        if (newPoints.length === 4) {
            // Draw the final connecting line (closing the rectangle)
            ctx.beginPath();
            ctx.moveTo(newPoints[3][0], newPoints[3][1]);
            ctx.lineTo(newPoints[0][0], newPoints[0][1]);
            ctx.stroke();

            // Update the spots state with the new quadrilateral
            setSpots((prevSpots) => {
                const updatedSpots = [...prevSpots];
                updatedSpots[currentImageIndex] = {
                    ...updatedSpots[currentImageIndex],
                    car_spots: [...updatedSpots[currentImageIndex].car_spots, newPoints], // Add new quadrilateral to car_spots
                };
                return updatedSpots;
            });

            // Reset points for the next rectangle
            setCurrentPoints([]);
        }
    };

    const drawRectangle = (ctx, points, squareNumber) => {
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        points.forEach((point, index) => {
            if (index < 3) {
                ctx.lineTo(points[index + 1][0], points[index + 1][1]);
            }
        });
        ctx.lineTo(points[0][0], points[0][1]); // Close the rectangle
        ctx.stroke();

        // Display the square number near the top-left corner of the rectangle
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.fillText(`{squareNumber}`, points[0][0] + 5, points[0][1] - 5); // Adjust position as needed
    };

    if (canvasImages.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className='flex flex-col items-center justify-center min-h-screen rounded'>
            <canvas ref={canvasRef} onClick={handleCanvasClick}></canvas>
            <div>Image {currentImageIndex + 1} of {canvasImages.length}</div>
            <button className='mt-4' onClick={() => setCurrentImageIndex((prevIndex) => (prevIndex + 1) % canvasImages.length)}>
                Next Image
            </button>
        </div>
    );
}
