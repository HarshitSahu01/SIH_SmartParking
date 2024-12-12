import React, { useEffect, useRef } from 'react';
import imageSrc from '../assets/sampleParking.png';

const BoxConfirmCanvas = ({ spots }) => {
  const canvasRef = useRef(null);

  spots = 

  console.log(spots);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.font = '16px Arial';
      ctx.fillStyle = 'blue';

      spots.forEach((spot, index) => {
        const quad = spot.coordinates;
        ctx.beginPath();
        ctx.moveTo(quad[0][0], quad[0][1]);
        for (let i = 1; i < quad.length; i++) {
          ctx.lineTo(quad[i][0], quad[i][1]);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fillText(`Spot ${index + 1}`, quad[0][0] + 5, quad[0][1] - 5);
      });
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

    const handleClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      spots.forEach((spot, index) => {
        if (isPointInPolygon(clickX, clickY, spot.coordinates)) {
          alert(`You clicked on Spot ${index + 1}`);
        }
      });
    };

    canvas.addEventListener('click', handleClick);
    return () => {
      canvas.removeEventListener('click', handleClick);
    };
  }, [imageSrc, spots]);

  return <canvas ref={canvasRef} style={{ border: '1px solid black' }}></canvas>;
};

export default BoxConfirmCanvas;
