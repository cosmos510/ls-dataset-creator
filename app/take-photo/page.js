'use client';

import { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useSession } from 'next-auth/react';

export default function TakePhoto() {
  const webcamRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [letter, setLetter] = useState('');
  const [progress, setProgress] = useState(0);
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
          setProgress(((batchIndex + 1) / totalBatches) * 100);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-700 text-white p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Capture Images for LSF Dataset</h1>

      <div className="letter-selection mb-6">
        <label htmlFor="letter" className="text-lg font-semibold">Select Letter: </label>
        <select
          id="letter"
          value={letter}
          onChange={(e) => setLetter(e.target.value)}
          className="mt-2 p-2 rounded-lg border border-gray-300"
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
        className="webcam-view mb-6 border-4 border-white rounded-lg"
      />

      <button
        onClick={captureImages}
        disabled={uploading || !letter || !session}
        className="bg-blue-600 text-white py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-all mb-6"
      >
        {uploading ? 'Uploading...' : 'Capture'}
      </button>

      {uploading && (
        <div className="progress-container w-full max-w-lg mt-4 mb-6">
          <div className="progress-bar h-3 bg-gray-300 rounded-full">
            <div
              className="progress-bar-filled bg-green-500 h-full rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}