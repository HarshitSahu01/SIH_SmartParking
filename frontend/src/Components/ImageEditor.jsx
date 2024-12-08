import React, { useRef, useState, useEffect } from 'react';
import { use } from 'react';

export default function ImageEditor() {
    const canvasRef = useRef(null);
    const [canvasImages, setCanvasImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0, factor: 0, requiredHeight: 500 });
    const [drawMode, setDrawMode] = useState('addCar'); // Current drawmode
    const [currentPoints, setCurrentPoints] = useState([]); // Points for the current rectangle being drawn
    const [spots, setSpots] = useState([]); // State to store spots for car and bike spots

    // when the page loads, fetch images and create spots array
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch('http://localhost:8000/getSampleImages');
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
                setSpots(new Array(loadedImages.length).fill({ car_spots: [], bike_spots: [] }));
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
    }, []);

    // Re-render drawing whenever images, current image, or spots change
    useEffect(() => {
        if (canvasImages.length > 0) {
            setCurrentPoints([]);
            redrawCanvas();
        }
    }, [canvasImages, currentImageIndex, spots, drawMode]); 

    const handleCanvasClick = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (drawMode === 'addCar' || drawMode === 'addBike') {
            setCurrentPoints((prevPoints) => {
                const newPoints = [...prevPoints, [x, y]]; // Store points as lists [x, y]
                draw(newPoints);
                return newPoints;
            });
        }
        if (drawMode === 'erase') {
            let spotRemoved = false;
            ['car_spots', 'bike_spots'].forEach((mode) => {
                if (spotRemoved) return;
                spots[currentImageIndex][mode].forEach((spot, index) => {
                    if (isPointInPolygon(x, y, spot)) {
                        setSpots((prevSpots) => {
                            const updatedSpots = [...prevSpots];
                            updatedSpots[currentImageIndex] = {
                                ...updatedSpots[currentImageIndex],
                                [mode]: updatedSpots[currentImageIndex][mode].filter((_, i) => i !== index),
                            };
                            return updatedSpots;
                        });
                        spotRemoved = true;
                    }
                });
            });
        }
    }

    const redrawCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const currentImage = canvasImages[currentImageIndex];
        canvas.height = imageDimensions.requiredHeight;
        canvas.width = currentImage.width * (imageDimensions.requiredHeight / currentImage.height);

        ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);

        spots[currentImageIndex]?.car_spots.forEach((spot, index) => {
            drawRectangle(ctx, spot, index + 1, 'car');
        });
        spots[currentImageIndex]?.bike_spots.forEach((spot, index) => {
            drawRectangle(ctx, spot, index + 1, 'bike'); 
        });
    }

    const draw = (newPoints = currentPoints) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = 'red';
        ctx.strokeStyle = '#6439FF';
        ctx.lineWidth = 2;

        newPoints.forEach((point, index) => {
            ctx.beginPath();
            ctx.arc(point[0], point[1], 5, 0, Math.PI * 2); 
            ctx.fill();

            if (index > 0) {
                ctx.beginPath();
                ctx.moveTo(newPoints[index - 1][0], newPoints[index - 1][1]);
                ctx.lineTo(point[0], point[1]);
                ctx.stroke();
            }
        });

        // rectangle is complete
        if (newPoints.length === 4) {
            ctx.beginPath();
            ctx.moveTo(newPoints[3][0], newPoints[3][1]);
            ctx.lineTo(newPoints[0][0], newPoints[0][1]);
            ctx.stroke();

            // Update the spots state with the new quadrilateral
            setSpots((prevSpots) => {
                const updatedSpots = [...prevSpots];
                if (drawMode === 'addCar') {
                    updatedSpots[currentImageIndex] = {
                        ...updatedSpots[currentImageIndex],
                        car_spots: [...updatedSpots[currentImageIndex].car_spots, newPoints], 
                    };
                } else if (drawMode === 'addBike') {
                    updatedSpots[currentImageIndex] = {
                        ...updatedSpots[currentImageIndex],
                        bike_spots: [...updatedSpots[currentImageIndex].bike_spots, newPoints],
                    };
                }
                return updatedSpots;
            });
        }
    };

    const drawRectangle = (ctx, points, squareNumber, type) => {
        ctx.strokeStyle = type === 'car' ? '#FFEB55' : '#D91656';
        if (type === 'bike') squareNumber = 'B' + squareNumber;
        else squareNumber = 'C' + squareNumber;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        points.forEach((point, index) => {
            if (index < 3) {
                ctx.lineTo(points[index + 1][0], points[index + 1][1]);
            }
        });
        ctx.lineTo(points[0][0], points[0][1]);
        ctx.stroke();

        // Display the square number at the center of the rectangle
        const centerX = (points[0][0] + points[1][0] + points[2][0] + points[3][0]) / 4;
        const centerY = (points[0][1] + points[1][1] + points[2][1] + points[3][1]) / 4;
        ctx.fillStyle = 'black';
        ctx.font = '20px cursive';
        ctx.fillText(`${squareNumber}`, centerX, centerY);
    };

    const isPointInPolygon = (x, y, polygon) => {
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i][0], yi = polygon[i][1];
            const xj = polygon[j][0], yj = polygon[j][1];
            const intersect = (yi > y !== yj > y) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    };


    const nextImageFunc = () => setCurrentImageIndex((prevIndex) => (prevIndex + 1) % canvasImages.length);
    const prevImageFunc = () => setCurrentImageIndex((prevIndex) => (prevIndex - 1 + canvasImages.length) % canvasImages.length);
    const drawModeFunc = (newDrawMode) => {
        newDrawMode != drawMode ? setDrawMode(newDrawMode) : false;
    }
    const undoFunc = () => {
        if (drawMode === 'addCar' || drawMode === 'addBike') {
            const updatedPoints = currentPoints.slice(0, -1);
            setCurrentPoints(updatedPoints);
            redrawCanvas();
            draw(updatedPoints);
        }
    }
    const eraseAllFunc = () => {
        let confirmation = confirm('Are you sure you want to erase all spots?');
        if (!confirmation) return;
        setSpots((prevSpots) => {
            const updatedSpots = [...prevSpots];
            updatedSpots[currentImageIndex] = { car_spots: [], bike_spots: [] };
            return updatedSpots;
        });
    }

    /*
    Draw mode options:
    addCar - add to car_spots
    addBike - add to bike_spots
    Erase - onclick of a box it gets erased
    
    additional features:
    nextImage
    prevImage
    Erase All - erase all boxes
    undo - undo last click
    */

    if (canvasImages.length === 0) {
        return <div>Loading...</div>;
    }
    return (
        <div className='flex flex-col items-center justify-center min-h-screen'>
            <canvas ref={canvasRef} onClick={handleCanvasClick} className='rounded-lg cursor-crosshair'></canvas>
            <div>Image {currentImageIndex + 1} of {canvasImages.length}</div>
            <button onClick={nextImageFunc}>Next Image</button>
            <button onClick={prevImageFunc}>Prev Image</button>
            <button onClick={() => drawModeFunc('addCar')}>Car Mode</button>
            <button onClick={() => drawModeFunc('addBike')}>Bike Mode</button>
            <button onClick={() => drawModeFunc('erase')}>Erase mode</button>
            <button onClick={eraseAllFunc}>Erase All</button>
            <button onClick={undoFunc}>Undo</button>
        </div>
    );
}
