import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';

const QRScanner = ({ onScanResult, isScanning, onStartScan, onStopScan }) => {
  const videoEl = useRef(null);
  const qrBoxEl = useRef(null);
  const scanner = useRef(null);
  const [error, setError] = useState('');

  const onScanSuccess = (result) => {
    console.log('QR Scanned:', result.data);
    onScanResult(result.data);
  };

  const onScanFail = (err) => {
    console.log('Scan failed:', err);
  };

  useEffect(() => {
    if (isScanning && videoEl.current && !scanner.current) {
      scanner.current = new QrScanner(
        videoEl.current,
        onScanSuccess,
        {
          onDecodeError: onScanFail,
          preferredCamera: 'environment',
          highlightScanRegion: true,
          highlightCodeOutline: true,
          overlay: qrBoxEl.current || undefined,
        }
      );

      scanner.current
        .start()
        .then(() => setError(''))
        .catch((err) => {
          setError('Camera access denied. Please allow camera permission.');
          console.error('Scanner start error:', err);
        });
    }

    return () => {
      if (scanner.current) {
        scanner.current.stop();
        scanner.current = null;
      }
    };
  }, [isScanning]);

  const handleStartScan = () => {
    setError('');
    onStartScan();
  };

  const handleStopScan = () => {
    if (scanner.current) {
      scanner.current.stop();
      scanner.current = null;
    }
    onStopScan();
  };

  return (
    <div className="qr-scanner">
      <h2>📱 Scan QR Code</h2>
      
      {!isScanning ? (
        <div className="scanner-start">
          <p>Ready to scan a payment QR code</p>
          <button onClick={handleStartScan} className="btn-primary">
            Start Camera
          </button>
        </div>
      ) : (
        <div className="scanner-active">
          <div className="qr-reader">
            <video ref={videoEl}></video>
            <div ref={qrBoxEl} className="qr-box">
              <div className="qr-frame"></div>
            </div>
          </div>
          
          <button onClick={handleStopScan} className="btn-secondary">
            Stop Scanning
          </button>
          
          {error && <p className="error-message">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default QRScanner;
