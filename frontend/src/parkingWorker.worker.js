let intervalId = null;

self.onmessage = (event) => {
  if (event.data.action === "startTracking") {
    const { spotsLeft, parkingName } = event.data;

    intervalId = setInterval(() => {
      self.postMessage({ message: `Spots left for ${parkingName}: ${spotsLeft}` });
    }, 10000); // Notify every 10 seconds
  } else if (event.data.action === "stopTracking") {
    clearInterval(intervalId);
  }
};
