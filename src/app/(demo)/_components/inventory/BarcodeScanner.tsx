"use client";

import { useState, useEffect, useRef } from "react";

export default function BarcodeScanner({ onScan, onClose }: any) {
  const [data, setData] = useState("No result");
  const [isScanning, setIsScanning] = useState(false);
  const hasBeepedRef = useRef(false); // This ref will track beep status more immediately
  const scannerContainerRef = useRef<HTMLDivElement>(null);
  const scannerInstanceRef = useRef<import("html5-qrcode").Html5Qrcode | null>(
    null
  );
  const audioContextRef = useRef<AudioContext | null>(null);

  const startedRef = useRef(false); // ✅ prevent multiple starts

  // Function to play a beep sound
  const playBeepSound = () => {
    // Check the ref immediately - this will work even if state hasn't updated yet
    if (hasBeepedRef.current) return;

    try {
      // Create audio context if it doesn't exist yet
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (
            window as typeof window & {
              webkitAudioContext?: typeof AudioContext;
            }
          ).webkitAudioContext)();
      }

      const context = audioContextRef.current;

      // Create oscillator (sound generator)
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      // Connect oscillator to gain node and gain node to audio output
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      // Set parameters for a grocery store scanner-like beep
      oscillator.type = "square"; // Square wave for a sharper sound
      oscillator.frequency.setValueAtTime(1800, context.currentTime); // Higher frequency for scanner sound

      // Set volume and duration
      gainNode.gain.setValueAtTime(0.5, context.currentTime);

      // Start sound and stop after 100ms
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.25);

      // Set both the ref and state - ref updates immediately
      hasBeepedRef.current = true;
    } catch (error) {
      console.error("Error playing beep sound:", error);
    }
  };

  useEffect(() => {
    if (startedRef.current) return; // ✅ avoid double init
    startedRef.current = true;
    // Reset beep status on component mount
    hasBeepedRef.current = false;
    let initTimer: any;
    // This will only run in the browser, not during SSR
    if (typeof window !== "undefined" && !scannerInstanceRef.current) {
      // Dynamic import
      import("html5-qrcode")
        .then(({ Html5Qrcode }) => {
          initTimer = setTimeout(() => {
            // Make sure the element exists before initializing
            if (scannerContainerRef.current) {
              // Instead of using Html5QrcodeScanner, we'll use Html5Qrcode directly
              // to have more control over the UI
              const html5QrCode = new Html5Qrcode("reader");

              // Get cameras
              Html5Qrcode.getCameras()
                .then((devices) => {
                  if (devices && devices.length > 0) {
                    // Try to find a back camera
                    const backCamera = devices.find(
                      (device) =>
                        device.label.toLowerCase().includes("back") ||
                        device.label.toLowerCase().includes("rear") ||
                        device.label.toLowerCase().includes("environment")
                    );

                    // Use back camera if found, otherwise use the first camera
                    const cameraId = backCamera ? backCamera.id : devices[0].id;

                    // Start scanning with chosen camera
                    html5QrCode
                      .start(
                        cameraId,
                        {
                          fps: 2,
                          qrbox: { width: 250, height: 250 },
                          aspectRatio: 1.0
                        },
                        (decodedText) => {
                          // Play beep sound when QR code is detected (will only play once)
                          playBeepSound();
                          setData(decodedText);

                          onScan(decodedText);
                          startedRef.current = false;
                          onClose();
                        },
                        (errorMessage) => {
                          console.warn("QR scan error:", errorMessage);
                        }
                      )
                      .then(() => {
                        setIsScanning(true);
                        scannerInstanceRef.current = html5QrCode;
                      })
                      .catch((err) => {
                        console.error("Error starting scanner:", err);
                      });
                  } else {
                    console.error("No cameras found");
                  }
                })
                .catch((err) => {
                  console.error("Error getting cameras:", err);
                });
            }
          }, 500); // Delay initialization to ensure DOM is ready
        })
        .catch((err) => {
          console.error("Failed to load html5-qrcode:", err);
        });
    }

    // Cleanup function
    return () => {
      clearTimeout(initTimer);

      if (scannerInstanceRef.current) {
        try {
          const scanner = scannerInstanceRef.current;
          if (scanner && scanner.isScanning) {
            scanner
              .stop()
              .catch((err: unknown) =>
                console.error("Error stopping scanner:", err)
              );
          }
        } catch (error) {
          console.error("Error during cleanup:", error);
        }
        scannerInstanceRef.current = null;
      }

      // Clean up audio context
      if (audioContextRef.current) {
        audioContextRef.current
          .close()
          .catch((err) => console.error("Error closing audio context:", err));
        audioContextRef.current = null;
      }
    };
  }, [onScan, onClose]);

  return (
    <div className="flex flex-col items-center p-4">
      <div
        id="reader"
        ref={scannerContainerRef}
        className="w-full max-w-md mb-4 border-1 border-gray-00"
      ></div>

      {!isScanning && <p className="text-gray-500 mb-4">Loading scanner...</p>}

      {/* <div className="mt-4 p-4 border rounded bg-gray-100 w-full max-w-md">
        <p className="font-medium text-gray-800">
          Result: <span className="text-blue-600">{data}</span>
        </p>
      </div> */}
    </div>
  );
}
