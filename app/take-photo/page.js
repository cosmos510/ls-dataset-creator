'use client';

import { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useSession } from 'next-auth/react';

export default function TakePhoto() {
  const webcamRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [letter, setLetter] = useState('');
  const { data: session } = useSession();

  const captureImages = async () => {
    if (!webcamRef.current || !letter) {
      alert('Please select a letter before capturing images.');
      return;
    }

    if (!session) {
      alert('Please log in to capture images.');
      return;
    }

    const capturedImages = [];
    const captureInterval = 1000; // 0.5 seconds
    const duration = 10000; // 10 seconds
    const totalCaptures = duration / captureInterval;

    for (let i = 0; i < totalCaptures; i++) {
      capturedImages.push(webcamRef.current.getScreenshot());
      await new Promise((resolve) => setTimeout(resolve, captureInterval));
    }

    if (!capturedImages.length || !letter || !session.user.id) {
      alert('Missing required fields.');
      return;
    }

    setUploading(true);
    try {
      const response = await fetch('/api/photo/timer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: capturedImages,
          letter,
          userId: session.user.id,
        }),
      });
      const result = await response.json();

      if (result.success) {
        alert(`Successfully uploaded ${capturedImages.length} images for letter "${letter}".`);
      } else {
        alert('Failed to upload images.');
      }
      console.log(result);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('An error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="take-photo-page">
      <h1>Capture Images for LSF Dataset</h1>
      <div className="letter-selection">
        <label htmlFor="letter">Select Letter: </label>
        <select
          id="letter"
          value={letter}
          onChange={(e) => setLetter(e.target.value)}
        >
          <option value="">--Select--</option>
          {[...'abcdefghijklmnopqrstuvwxyz'].map((char) => (
            <option key={char} value={char}>
              {char.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        className="webcam-view"
      />
      <button
        onClick={captureImages}
        disabled={uploading || !letter || !session}
        className="capture-button"
      >
        {uploading ? 'Uploading...' : 'Capture'}
      </button>
    </div>
  );
}