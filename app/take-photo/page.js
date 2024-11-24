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
    const captureInterval = 1000;
    const duration = 10000;
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

    const batchSize = 5;
    const totalBatches = Math.ceil(capturedImages.length / batchSize);

    try {
      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const batch = capturedImages.slice(batchIndex * batchSize, (batchIndex + 1) * batchSize);

        const response = await fetch('/api/photo/timer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            images: batch,
            letter,
            userId: session.user.id,
          }),
        });

        const result = await response.json();

        if (result.success) {
          alert(`Successfully uploaded batch ${batchIndex + 1} of ${totalBatches} images for letter "${letter}".`);
        } else {
          alert('Failed to upload images.');
          break;
        }
      }
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