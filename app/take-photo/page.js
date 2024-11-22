'use client';

import { useRef, useState } from 'react';
import Webcam from 'react-webcam';

export default function TakePhoto() {
  const webcamRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const captureImages = async () => {
    if (!webcamRef.current) return;

    const capturedImages = [];
    const captureInterval = 500; // 0.5 seconds
    const duration = 10000; // 10 seconds
    const totalCaptures = duration / captureInterval;

    for (let i = 0; i < totalCaptures; i++) {
      capturedImages.push(webcamRef.current.getScreenshot());
      await new Promise((resolve) => setTimeout(resolve, captureInterval));
    }

    // Upload the images
    setUploading(true);
    try {
      const response = await fetch('/api/photo/timer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: capturedImages }),
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="take-photo-page">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        className="webcam-view"
      />
      <button
        onClick={captureImages}
        disabled={uploading}
        className="capture-button"
      >
        {uploading ? 'Uploading...' : 'Capture'}
      </button>
    </div>
  );
}