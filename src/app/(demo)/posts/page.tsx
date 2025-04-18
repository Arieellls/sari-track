// "use client";

// import { useEffect, useRef, useState } from "react";

// export default function Home() {
//   const [data, setData] = useState("No result");
//   const [isScanning, setIsScanning] = useState(false);
//   const html5QrCodeRef = useRef<any>(null);
//   const hasBeepedRef = useRef(false);
//   const audioContextRef = useRef<AudioContext | null>(null);

//   // Play a short beep (like a scanner)
//   const playBeepSound = () => {
//     if (hasBeepedRef.current) return;

//     try {
//       if (!audioContextRef.current) {
//         audioContextRef.current = new (window.AudioContext ||
//           (window as any).webkitAudioContext)();
//       }

//       const context = audioContextRef.current;
//       const oscillator = context.createOscillator();
//       const gainNode = context.createGain();

//       oscillator.connect(gainNode);
//       gainNode.connect(context.destination);

//       oscillator.type = "square";
//       oscillator.frequency.setValueAtTime(1800, context.currentTime);
//       gainNode.gain.setValueAtTime(0.5, context.currentTime);

//       oscillator.start(context.currentTime);
//       oscillator.stop(context.currentTime + 0.25);

//       hasBeepedRef.current = true;
//     } catch (error) {
//       console.error("Beep failed:", error);
//     }
//   };

//   useEffect(() => {
//     let scanner: any;
//     let isMounted = true;
//     hasBeepedRef.current = false;

//     const loadScanner = async () => {
//       if (!isMounted) return;

//       const { Html5Qrcode } = await import("html5-qrcode");

//       scanner = new Html5Qrcode("reader");
//       html5QrCodeRef.current = scanner;

//       Html5Qrcode.getCameras()
//         .then((devices) => {
//           if (devices && devices.length) {
//             const cameraId = devices[0].id;

//             scanner
//               .start(
//                 cameraId,
//                 {
//                   fps: 10,
//                   qrbox: { width: 250, height: 250 }
//                 },
//                 (decodedText: string) => {
//                   playBeepSound();
//                   setData(decodedText);
//                 },
//                 (errorMessage: string) => {
//                   // handle scan error silently
//                 }
//               )
//               .then(() => setIsScanning(true))
//               .catch((err: any) =>
//                 console.error("Error starting QR scanner", err)
//               );
//           }
//         })
//         .catch((err) => console.error("Camera fetch error", err));
//     };

//     loadScanner();

//     return () => {
//       isMounted = false;
//       if (html5QrCodeRef.current) {
//         html5QrCodeRef.current
//           .stop()
//           .then(() => html5QrCodeRef.current.clear())
//           .catch((err: any) => console.error("Error stopping QR scanner", err));
//       }

//       if (audioContextRef.current) {
//         audioContextRef.current.close().catch(() => {});
//         audioContextRef.current = null;
//       }
//     };
//   }, []);

//   return (
//     <div className="flex flex-col items-center p-4">
//       <h1 className="text-2xl font-bold mb-4">QR Scanner</h1>
//       <div
//         id="reader"
//         className="w-full max-w-md mb-4"
//         style={{
//           transform: "none",
//           overflow: "hidden",
//           display: "block"
//         }}
//       ></div>
//       <div className="mt-4 p-4 border rounded bg-gray-100 w-full max-w-md">
//         <p className="font-medium text-gray-800">
//           Result: <span className="text-blue-600">{data}</span>
//         </p>
//       </div>
//     </div>
//   );
// }
