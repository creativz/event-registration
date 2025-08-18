import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import jsQR from 'jsqr';
import { BrowserQRCodeReader } from '@zxing/library';
import { qrCodeService } from '../services/qrCodeService';
import { firebaseService } from '../services/firebaseService';
import { RegistrationData } from '../types';
import { QrCode, CheckCircle, XCircle, Search, RefreshCw, Camera, Video, VideoOff, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const QRVerification: React.FC = () => {
  const [qrData, setQrData] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    registration?: RegistrationData;
    message: string;
  } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [manualId, setManualId] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanAttempts, setScanAttempts] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [showDebugImage, setShowDebugImage] = useState(false);
  const [debugImageData, setDebugImageData] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const qrReaderRef = useRef<BrowserQRCodeReader | null>(null);
  const navigate = useNavigate();
  const { signOut, authUser } = useAuth();

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (qrReaderRef.current) {
        qrReaderRef.current.reset();
      }
    };
  }, [cameraStream]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      setIsCameraActive(true);
      setScanAttempts(0);
      setIsScanning(false);
      
      // Initialize ZXing QR reader
      qrReaderRef.current = new BrowserQRCodeReader();
      
      // Simple camera constraints that work on most devices
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'environment'
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);

      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = stream;
        
        // Wait for video to be ready
        video.onloadedmetadata = () => {
          console.log('Video ready, dimensions:', video.videoWidth, 'x', video.videoHeight);
          video.play()
            .then(() => {
              console.log('Video playing successfully');
              // Don't start scanning automatically - wait for button press
            })
            .catch(err => {
              console.error('Video play error:', err);
              setCameraError('Failed to start video playback');
            });
        };

        video.onerror = (e) => {
          console.error('Video error:', e);
          setCameraError('Video error occurred');
        };
      }
    } catch (error: any) {
      console.error('Camera access error:', error);
      setCameraError(error.message || 'Failed to access camera');
      setIsCameraActive(false);
      
      if (error.name === 'NotAllowedError') {
        toast.error('Camera permission denied. Please allow camera access.');
      } else if (error.name === 'NotFoundError') {
        toast.error('No camera found on this device.');
      } else {
        toast.error('Camera access failed. Please use file upload instead.');
      }
    }
  };

  const manualScan = async () => {
    if (!isCameraActive || isScanning) return;
    
    setIsScanning(true);
    setScanAttempts(prev => prev + 1);
    
    try {
      console.log('Manual scan attempt:', scanAttempts + 1);
      
      // Capture current frame from video
      const video = videoRef.current;
      const canvas = cameraCanvasRef.current;
      
      if (!video || !canvas) {
        throw new Error('Video or canvas not available');
      }
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas context not available');
      }
      
      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Save debug image
      setDebugImageData(canvas.toDataURL());
      setShowDebugImage(true);
      
      // Get image data for QR detection
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      console.log('Scanning image with dimensions:', canvas.width, 'x', canvas.height);
      
      // Try jsQR first (more reliable for manual scanning)
      let code = jsQR(imageData.data, imageData.width, imageData.height);
      
      if (!code) {
        console.log('Trying jsQR with dontInvert option...');
        code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
      }
      
      if (!code) {
        console.log('Trying jsQR with onlyInvert option...');
        code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "onlyInvert",
        });
      }
      
      if (code) {
        console.log('jsQR Code detected:', code.data);
        setQrData(code.data);
        handleQRVerification(code.data);
        stopCamera();
        toast.success('QR code detected successfully!');
        return;
      }
      
      // Note: ZXing canvas decoding not available, using jsQR only
      
      // No QR code found
      console.log('No QR code found in captured frame');
      toast.error('No QR code found. Please ensure the QR code is clearly visible in the frame and try again.');
      
    } catch (error) {
      console.error('Manual scan error:', error);
      toast.error('Scan failed. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (qrReaderRef.current) {
      qrReaderRef.current.reset();
    }
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
    setCameraError(null);
    setScanAttempts(0);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const handleQRVerification = async (qrCodeData: string) => {
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      // Verify QR code data
      const verifiedData = qrCodeService.verifyQRCode(qrCodeData);
      
      if (!verifiedData) {
        setVerificationResult({
          success: false,
          message: 'Invalid QR code format'
        });
        return;
      }

      // Get registration data from Firebase
      const registrations = await firebaseService.getRegistrations();
      const registration = registrations.find(r => r.id === verifiedData.registrationId);

      if (!registration) {
        setVerificationResult({
          success: false,
          message: 'Registration not found'
        });
        return;
      }

      setVerificationResult({
        success: true,
        registration,
        message: 'Registration verified successfully'
      });

      toast.success(`Welcome, ${registration.firstName} ${registration.lastName}!`);
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResult({
        success: false,
        message: 'Error verifying registration'
      });
      toast.error('Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleManualVerification = async () => {
    if (!manualId.trim()) {
      toast.error('Please enter a registration ID');
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const registrations = await firebaseService.getRegistrations();
      const registration = registrations.find(r => r.id === manualId.trim());

      if (!registration) {
        setVerificationResult({
          success: false,
          message: 'Registration not found'
        });
        return;
      }

      setVerificationResult({
        success: true,
        registration,
        message: 'Registration verified successfully'
      });

      toast.success(`Welcome, ${registration.firstName} ${registration.lastName}!`);
    } catch (error) {
      console.error('Manual verification error:', error);
      setVerificationResult({
        success: false,
        message: 'Error verifying registration'
      });
      toast.error('Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const processQRCodeImage = (file: File) => {
    setIsProcessingImage(true);
    
    const canvas = canvasRef.current;
    if (!canvas) {
      setIsProcessingImage(false);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsProcessingImage(false);
      return;
    }

    const img = new Image();
    img.onload = () => {
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image on canvas
      ctx.drawImage(img, 0, 0);
      
      // Get image data for QR code detection
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Try different QR code detection approaches
      let code = jsQR(imageData.data, imageData.width, imageData.height);
      
      // If no QR code found, try with different options
      if (!code) {
        console.log('Trying QR detection with dontInvert option...');
        code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
      }
      
      if (!code) {
        console.log('Trying QR detection with onlyInvert option...');
        code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "onlyInvert",
        });
      }
      
      if (code) {
        console.log('QR Code detected in image:', code.data);
        setQrData(code.data);
        handleQRVerification(code.data);
        toast.success('QR code detected successfully!');
      } else {
        console.log('No QR code found in image. Image dimensions:', img.width, 'x', img.height);
        toast.error('No QR code found in the image. Please ensure the QR code is clear and well-lit.');
      }
      
      setIsProcessingImage(false);
    };
    
    img.onerror = () => {
      console.error('Error loading image');
      toast.error('Error loading image');
      setIsProcessingImage(false);
    };
    
    img.src = URL.createObjectURL(file);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    processQRCodeImage(file);
  };

  const resetVerification = () => {
    setQrData('');
    setVerificationResult(null);
    setManualId('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (isCameraActive) {
      stopCamera();
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/admin/login');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Header with user info and logout */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <QrCode className="w-6 h-6 text-primary-600" />
              <h1 className="text-xl font-bold text-gray-800">Event Check-in System</h1>
            </div>
            <div className="flex items-center space-x-4">
              {authUser && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{authUser.email}</span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <QrCode className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Event Check-in</h2>
            <p className="text-gray-600">Scan QR code or enter registration ID to verify attendance</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* QR Code Verification */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">QR Code Verification</h2>
              
              <div className="space-y-4">
                {/* Camera Scanner */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scan QR Code with Camera
                  </label>
                  {!isCameraActive ? (
                    <div className="space-y-2">
                      <button
                        onClick={startCamera}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center justify-center space-x-2"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Start Camera Scanner</span>
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            const devices = await navigator.mediaDevices.enumerateDevices();
                            const videoDevices = devices.filter(device => device.kind === 'videoinput');
                            console.log('Available video devices:', videoDevices);
                            toast.success(`Found ${videoDevices.length} camera(s)`);
                          } catch (error) {
                            console.error('Error enumerating devices:', error);
                            toast.error('Error checking cameras');
                          }
                        }}
                        className="w-full bg-gray-500 text-white py-1 px-2 rounded text-xs hover:bg-gray-600"
                      >
                        Debug: Check Available Cameras
                      </button>
                      <button
                        onClick={() => {
                          // Generate a test QR code data
                          const testData = {
                            registrationId: 'test-registration-123',
                            timestamp: new Date().toISOString(),
                            event: 'Malikhaing Pinoy Expo 2025'
                          };
                          const qrData = JSON.stringify(testData);
                          setQrData(qrData);
                          toast.success('Test QR code data generated. Use "Verify QR Code" button to test.');
                        }}
                        className="w-full bg-blue-500 text-white py-1 px-2 rounded text-xs hover:bg-blue-600"
                      >
                        Generate Test QR Data
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="relative">
                        <video
                          ref={videoRef}
                          className="w-full h-64 object-cover rounded-lg border-2 border-primary-500"
                          autoPlay
                          playsInline
                          muted
                        />
                        <div className="absolute inset-0 border-2 border-primary-500 rounded-lg pointer-events-none">
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white rounded-lg"></div>
                        </div>
                        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                          Camera Active
                        </div>
                        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                          Attempts: {scanAttempts}
                        </div>
                        {cameraError && (
                          <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                            Error
                          </div>
                        )}
                      </div>
                                              {cameraError && (
                          <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
                            {cameraError}
                          </div>
                        )}
                        {showDebugImage && debugImageData && (
                          <div className="mt-2 p-2 bg-gray-50 rounded">
                            <p className="text-xs text-gray-600 mb-2">Last captured frame:</p>
                            <img 
                              src={debugImageData} 
                              alt="Captured frame" 
                              className="w-full max-w-xs mx-auto border rounded"
                            />
                            <button
                              onClick={() => setShowDebugImage(false)}
                              className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                            >
                              Hide debug image
                            </button>
                          </div>
                        )}
                      <div className="text-xs text-gray-600 text-center">
                        Point camera at QR code to scan
                      </div>
                      <button
                        onClick={stopCamera}
                        className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 flex items-center justify-center space-x-2"
                      >
                        <VideoOff className="w-4 h-4" />
                        <span>Stop Camera</span>
                      </button>
                      <button
                        onClick={manualScan}
                        disabled={!isCameraActive || isScanning}
                        className="mt-2 w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        {isScanning ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Scanning...</span>
                          </>
                        ) : (
                          <>
                            <Search className="w-4 h-4" />
                            <span>Manual Scan</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or Upload QR Code Image
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    disabled={isProcessingImage}
                  />
                  {isProcessingImage && (
                    <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processing QR code...</span>
                    </div>
                  )}
                </div>

                {/* Manual QR Data Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or Paste QR Code Data
                  </label>
                  <textarea
                    value={qrData}
                    onChange={(e) => setQrData(e.target.value)}
                    placeholder="Paste QR code data here..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                  />
                  {qrData && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                      <strong>QR Data Preview:</strong> {qrData.length > 100 ? qrData.substring(0, 100) + '...' : qrData}
                    </div>
                  )}
                  <button
                    onClick={() => handleQRVerification(qrData)}
                    disabled={!qrData.trim() || isVerifying}
                    className="mt-2 w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <QrCode className="w-4 h-4" />
                        <span>Verify QR Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Manual Verification */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Manual Verification</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration ID
                  </label>
                  <input
                    type="text"
                    value={manualId}
                    onChange={(e) => setManualId(e.target.value)}
                    placeholder="Enter registration ID..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={handleManualVerification}
                  disabled={!manualId.trim() || isVerifying}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Verify Registration</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Verification Result */}
          {verificationResult && (
            <div className="mt-8">
              <div className={`p-6 rounded-lg border ${
                verificationResult.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center space-x-3">
                  {verificationResult.success ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                  <div>
                    <h3 className={`font-semibold ${
                      verificationResult.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {verificationResult.message}
                    </h3>
                    {verificationResult.registration && (
                      <div className="mt-3 space-y-2 text-sm">
                        <p><strong>Name:</strong> {verificationResult.registration.firstName} {verificationResult.registration.lastName}</p>
                        <p><strong>Email:</strong> {verificationResult.registration.email}</p>
                        <p><strong>Institution:</strong> {verificationResult.registration.institution}</p>
                        <p><strong>Registration ID:</strong> {verificationResult.registration.id}</p>
                        <p><strong>Registration Date:</strong> {verificationResult.registration.registrationDate.toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reset Button */}
          {verificationResult && (
            <div className="mt-6 text-center">
              <button
                onClick={resetVerification}
                className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
              >
                Verify Another Registration
              </button>
            </div>
          )}

          {/* Hidden canvases for image processing */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <canvas ref={cameraCanvasRef} style={{ display: 'none' }} />
        </div>
      </div>
    </div>
  );
};

export default QRVerification;
