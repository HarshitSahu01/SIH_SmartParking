import React, { useRef, useEffect } from "react";
import logo from "../assets/parking_logo.svg";
import BoxConfirmCanvas from "../Components/BoxConfirmCanvas";
import imageSrc from '../assets/sampleParking.png';

const ParkingSpaceForm = () => {
    const canvasRef = useRef(null);
    // const imageSrc = 'your-image-path.jpg'; // Replace with the actual image path

    // Quadrilaterals: [[x1, y1, x2, y2, x3, y3, x4, y4], ...]
    const quadrilaterals = [
        [50, 50, 150, 50, 150, 200, 50, 200],  // Quadrilateral 1
        [200, 100, 320, 100, 300, 180, 180, 180], // Quadrilateral 2
        [400, 300, 550, 300, 520, 400, 380, 400] // Quadrilateral 3
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const image = new Image();

        image.src = imageSrc;

        image.onload = () => {
            // Set canvas size to match the image
            canvas.width = image.width;
            canvas.height = image.height;

            // Draw the image
            ctx.drawImage(image, 0, 0);

            // Draw quadrilaterals and number them
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.font = '16px Arial';
            ctx.fillStyle = 'blue';

            quadrilaterals.forEach((quad, index) => {
                ctx.beginPath();
                ctx.moveTo(quad[0], quad[1]);
                for (let i = 2; i < quad.length; i += 2) {
                    ctx.lineTo(quad[i], quad[i + 1]);
                }
                ctx.closePath();
                ctx.stroke();

                // Add number at the first vertex
                ctx.fillText(`Q${index + 1}`, quad[0] + 5, quad[1] - 5);
            });
        };

        // Point-in-polygon check using ray-casting algorithm
        const isPointInPolygon = (x, y, polygon) => {
            let inside = false;
            for (let i = 0, j = polygon.length / 2 - 1; i < polygon.length / 2; j = i++) {
                const xi = polygon[i * 2], yi = polygon[i * 2 + 1];
                const xj = polygon[j * 2], yj = polygon[j * 2 + 1];

                const intersect = ((yi > y) !== (yj > y)) &&
                                  (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }
            return inside;
        };

        // Handle clicks on the canvas
        const handleClick = (event) => {
            const rect = canvas.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;

            quadrilaterals.forEach((quad, index) => {
                if (isPointInPolygon(clickX, clickY, quad)) {
                    alert(`You clicked on Quadrilateral ${index + 1}`);
                }
            });
        };

        canvas.addEventListener('click', handleClick);

        // Cleanup event listener on component unmount
        return () => {
            canvas.removeEventListener('click', handleClick);
        };
    }, [imageSrc, quadrilaterals]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
};

export default ParkingSpaceForm;
