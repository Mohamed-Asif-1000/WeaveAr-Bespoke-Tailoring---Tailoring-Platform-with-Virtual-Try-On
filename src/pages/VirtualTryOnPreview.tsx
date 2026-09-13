import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import { X, RotateCcw, Check, AlertCircle } from "lucide-react";
import shirtFrontWhite from "../assets/front-view.png";
import shirtBackWhite from "../assets/back-view.png";
import shirtLeftWhite from "../assets/left-view.png";
import shirtRightWhite from "../assets/right-view.png";

const WIDTH = 640;
const HEIGHT = 480;

interface ShirtPreset {
  front: string;
  back: string;
  left: string;
  right: string;
  name: string;
  color: string;
}

const SHIRT_PRESETS: Record<string, ShirtPreset> = {
  "oxford-white": {
    front: shirtFrontWhite,
    back: shirtBackWhite,
    left: shirtLeftWhite,
    right: shirtRightWhite,
    name: "Oxford White",
    color: "white",
  },
  "classic-blue": {
    front: shirtFrontWhite,
    back: shirtBackWhite,
    left: shirtLeftWhite,
    right: shirtRightWhite,
    name: "Oxford White",
    color: "white",
  },
  "formal-black": {
    front: shirtFrontWhite,
    back: shirtBackWhite,
    left: shirtLeftWhite,
    right: shirtRightWhite,
    name: "Oxford White",
    color: "white",
  },
};

interface PosePoints {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  rotation: number;
  isValid: boolean;
}

function calculateShirtPosition(pose: poseDetection.Pose): PosePoints {
  const kp = pose.keypoints;

  const getKeypoint = (name: string) => {
    const point = kp.find((k) => k.name === name);
    return point && (point.score ?? 0) > 0.4 ? point : null;
  };

  const ls = getKeypoint("left_shoulder");
  const rs = getKeypoint("right_shoulder");
  const lh = getKeypoint("left_hip");
  const rh = getKeypoint("right_hip");

  if (!ls || !rs || !lh || !rh) {
    return {
      centerX: WIDTH / 2,
      centerY: HEIGHT / 2,
      width: 150,
      height: 200,
      rotation: 0,
      isValid: false,
    };
  }

  const shoulderWidth = Math.abs(rs.x - ls.x);
  const torsoHeight = Math.abs(lh.y - ls.y);

  const shirtWidth = Math.max(shoulderWidth * 1.5, 100);
  const shirtHeight = Math.max(torsoHeight * 1.3, 150);

  const shoulderCenterX = (ls.x + rs.x) / 2;
  const hipCenterX = (lh.x + rh.x) / 2;
  const shoulderCenterY = (ls.y + rs.y) / 2;
  const hipCenterY = (lh.y + rh.y) / 2;

  const centerX = (shoulderCenterX + hipCenterX) / 2;
  const centerY = (shoulderCenterY + hipCenterY) / 2;

  let rotation = Math.atan2(rs.y - ls.y, rs.x - ls.x);
  if (rotation > Math.PI / 2) rotation -= Math.PI;
  if (rotation < -Math.PI / 2) rotation += Math.PI;

  return {
    centerX,
    centerY,
    width: shirtWidth,
    height: shirtHeight,
    rotation,
    isValid: true,
  };
}

function drawSkeleton(ctx: CanvasRenderingContext2D, pose: poseDetection.Pose) {
  pose.keypoints.forEach((kp) => {
    if ((kp.score ?? 0) > 0.3) {
      ctx.beginPath();
      ctx.arc(kp.x, kp.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = "#00FF00";
      ctx.fill();
    }
  });

  const edges = [
    [5, 7],
    [7, 9],
    [6, 8],
    [8, 10],
    [5, 6],
    [5, 11],
    [6, 12],
    [11, 12],
    [11, 13],
    [13, 15],
    [12, 14],
    [14, 16],
  ];

  ctx.strokeStyle = "#00FF00";
  ctx.lineWidth = 2;

  edges.forEach(([from, to]) => {
    const kp1 = pose.keypoints[from];
    const kp2 = pose.keypoints[to];

    if (kp1 && kp2 && (kp1.score ?? 0) > 0.3 && (kp2.score ?? 0) > 0.3) {
      ctx.beginPath();
      ctx.moveTo(kp1.x, kp1.y);
      ctx.lineTo(kp2.x, kp2.y);
      ctx.stroke();
    }
  });
}

function drawShirtOverlay(
  ctx: CanvasRenderingContext2D,
  shirtImage: HTMLImageElement | null,
  posePoints: PosePoints,
  fallbackColor: string,
) {
  const { centerX, centerY, width, height, rotation } = posePoints;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);

  if (shirtImage && shirtImage.complete && shirtImage.naturalHeight > 0) {
    ctx.globalAlpha = 0.85;
    ctx.drawImage(shirtImage, -width / 2, -height / 2, width, height);
  } else {
    ctx.globalAlpha = 0.75;
    ctx.fillStyle =
      {
        white: "#FFFFFF",
        blue: "#4A90E2",
        black: "#1A1A1A",
      }[fallbackColor] || "#CCCCCC";

    ctx.fillRect(-width / 2, -height / 2, width, height);

    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 2;
    ctx.strokeRect(-width / 2, -height / 2, width, height);

    ctx.beginPath();
    ctx.moveTo(0, -height / 2 + 20);
    ctx.lineTo(0, height / 2 - 20);
    ctx.stroke();

    const collarWidth = width / 6;
    ctx.beginPath();
    ctx.moveTo(-collarWidth, -height / 2);
    ctx.lineTo(0, -height / 2 + 25);
    ctx.lineTo(collarWidth, -height / 2);
    ctx.stroke();
  }

  ctx.restore();
}

interface TryOnSessionProps {
  initialShirt: string;
  onRequestReset: () => void;
}

function TryOnSession({ initialShirt, onRequestReset }: TryOnSessionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectorRef = useRef<poseDetection.PoseDetector | null>(null);
  const navigate = useNavigate();

  const [selectedShirt, setSelectedShirt] = useState(initialShirt);
  const [pose, setPose] = useState<poseDetection.Pose | null>(null);
  const [view, setView] = useState<"front" | "back" | "left" | "right">(
    "front",
  );
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [shirtImage, setShirtImage] = useState<HTMLImageElement | null>(null);
  const [poseDetected, setPoseDetected] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    const shirtPreset = SHIRT_PRESETS[selectedShirt];
    if (!shirtPreset) return;

    const viewImage = shirtPreset[view as keyof typeof shirtPreset];
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = viewImage;

    img.onload = () => {
      setShirtImage(img);
    };

    img.onerror = () => {
      setShirtImage(null);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [selectedShirt, view]);

  useEffect(() => {
    let animationId: number;
    let poseDetectionReady = false;

    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: WIDTH },
            height: { ideal: HEIGHT },
            facingMode: "user",
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(() => {
              setCameraError("Could not play camera stream");
            });
          };
        }
      } catch (error) {
        if (error instanceof DOMException) {
          if (error.name === "NotAllowedError") {
            setCameraError(
              "Camera permission denied. Please enable camera access in your browser settings.",
            );
          } else if (error.name === "NotFoundError") {
            setCameraError(
              "No camera found on this device. Please use a device with a camera.",
            );
          } else {
            setCameraError(error.message);
          }
        } else {
          setCameraError("Failed to initialize camera");
        }
      }
    }

    async function setupPoseDetection() {
      try {
        setModelLoading(true);
        await tf.ready();

        try {
          await tf.setBackend("webgl");
        } catch {
          await tf.setBackend("cpu");
        }

        detectorRef.current = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          {
            modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
            enableSmoothing: true,
          },
        );

        poseDetectionReady = true;
        setModelLoading(false);
        setLoading(false);
      } catch {
        setCameraError("Failed to load pose detection model");
        setLoading(false);
      }
    }

    async function startPoseDetection() {
      const detect = async () => {
        if (
          poseDetectionReady &&
          videoRef.current &&
          detectorRef.current &&
          videoRef.current.readyState === 4
        ) {
          try {
            const poses = await detectorRef.current.estimatePoses(
              videoRef.current,
            );
            if (poses[0]) {
              setPose(poses[0]);
              setPoseDetected(true);
            } else {
              setPoseDetected(false);
            }
          } catch {
            setPoseDetected(false);
          }
        }
        animationId = requestAnimationFrame(detect);
      };
      detect();
    }

    setupCamera();
    setupPoseDetection();
    const timer = setTimeout(startPoseDetection, 500);

    const videoEl = videoRef.current;

    return () => {
      clearTimeout(timer);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }

      const stream = videoEl?.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  const [loadingStatus, setLoadingStatus] = useState("Initializing camera...");

  useEffect(() => {
    const messages = [
      "Initializing camera...",
      "Downloading AI model...",
      "Setting up pose detection...",
    ];

    let messageIndex = 0;
    const interval = setInterval(() => {
      if (messageIndex < messages.length) {
        setLoadingStatus(messages[messageIndex]);
        messageIndex++;
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        setLoadingTimeout(true);
      }
    }, 120000);

    return () => clearTimeout(timeout);
  }, [loading]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video || !pose) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, WIDTH, HEIGHT);

    if (showSkeleton) {
      drawSkeleton(ctx, pose);
    }

    const posePoints = calculateShirtPosition(pose);
    const shirtPreset = SHIRT_PRESETS[selectedShirt];
    drawShirtOverlay(
      ctx,
      shirtImage,
      posePoints,
      shirtPreset?.color || "white",
    );
  }, [pose, shirtImage, showSkeleton, selectedShirt]);

  if (cameraError) {
    return (
      <section className="bg-[#1A1A1A] text-[#FAF9F6] min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-serif mb-4">Camera Access Issue</h2>
          <p className="text-[#FAF9F6]/70 mb-8 leading-relaxed">
            {cameraError}
          </p>
          <div className="space-y-3">
            <button
              onClick={onRequestReset}
              className="w-full bg-[#D4AF37] text-black py-3 text-sm tracking-widest uppercase font-medium hover:opacity-90 transition"
            >
              Try Again
            </button>
            <button
              onClick={goBack}
              className="w-full border border-[#D4AF37]/30 text-[#D4AF37] py-3 text-sm tracking-widest uppercase hover:border-[#D4AF37] transition"
            >
              Go Back
            </button>
          </div>
          <p className="text-xs text-[#FAF9F6]/50 mt-8">
            💡 To use virtual try-on, you need to:
            <br />
            1. Allow camera access when prompted
            <br />
            2. Ensure good lighting
            <br />
            3. Stand 2-3 feet from camera
          </p>
        </div>
      </section>
    );
  }

  if (loadingTimeout) {
    return (
      <section className="bg-[#1A1A1A] text-[#FAF9F6] min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-serif mb-4">Taking too long?</h2>
          <p className="text-[#FAF9F6]/70 mb-8">
            The model download might be slow or stuck. Try these:
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-[#D4AF37] text-black py-3 text-sm tracking-widest uppercase font-medium hover:opacity-90 transition"
            >
              Refresh Page
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full border border-[#D4AF37]/30 text-[#D4AF37] py-3 text-sm tracking-widest uppercase hover:border-[#D4AF37] transition"
            >
              Go Back
            </button>
          </div>
          <p className="text-xs text-[#FAF9F6]/50 mt-6">
            💡 If this persists, clear browser cache (Settings → Privacy → Clear
            browsing data)
          </p>
        </div>
      </section>
    );
  }
  return (
    <section className="bg-[#1A1A1A] text-[#FAF9F6] min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] tracking-[6px] uppercase text-[#D4AF37] mb-2 font-bold">
                Virtual Try-On
              </p>
              <h1 className="text-3xl md:text-5xl font-serif">See It On You</h1>
            </div>
            <button
              onClick={goBack}
              className="p-2 hover:bg-[#2D2A26] rounded transition"
              title="Close"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-xs text-[#FAF9F6]/50">
            {loadingStatus}
            <br />
            <span className="text-[11px]">
              (This may take up to 30 seconds on first load)
            </span>
          </p>
          <p className="text-[#FAF9F6]/70 text-sm md:text-base">
            {modelLoading && "Loading AI model..."}
            {!modelLoading && !poseDetected && "Stand in front of your camera"}
            {!modelLoading && poseDetected && "Shirt is fitted to your body"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2">
            <div className="relative bg-black border-2 border-[#D4AF37]/30 rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                width={WIDTH}
                height={HEIGHT}
                className="hidden"
              />

              <canvas
                ref={canvasRef}
                width={WIDTH}
                height={HEIGHT}
                className="w-full h-auto block"
              />

              {(loading || modelLoading) && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 gap-4">
                  <div className="w-12 h-12 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-center">
                    <p className="text-sm font-medium mb-2">Initializing</p>
                    <p className="text-xs text-[#FAF9F6]/50">
                      {loading ? "Starting camera..." : "Loading model..."}
                    </p>
                  </div>
                </div>
              )}

              {!loading && !modelLoading && (
                <>
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/70 px-3 py-2 rounded text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Camera Active</span>
                  </div>

                  {!poseDetected && (
                    <div className="absolute bottom-4 left-4 right-4 bg-yellow-500/20 border border-yellow-500/50 rounded px-3 py-2 text-xs text-yellow-200">
                      ⚠️ Move closer to camera to detect body
                    </div>
                  )}

                  {poseDetected && (
                    <div className="absolute bottom-4 right-4 bg-green-500/20 border border-green-500/50 rounded px-3 py-2 text-xs text-green-200 flex items-center gap-2">
                      <Check size={14} />
                      Body detected
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs tracking-[3px] uppercase text-[#D4AF37] mb-3 font-bold">
                  View Angle
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {(["front", "left", "right", "back"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className={`py-2 md:py-3 text-xs tracking-[2px] uppercase transition-all font-medium ${
                        view === v
                          ? "bg-[#D4AF37] text-black"
                          : "bg-[#2D2A26] border border-[#D4AF37]/30 text-[#D4AF37] hover:border-[#D4AF37]"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 md:flex md:gap-3">
                <button
                  onClick={() => setShowSkeleton(!showSkeleton)}
                  className={`flex-1 py-3 text-xs tracking-[2px] uppercase transition-all border font-medium ${
                    showSkeleton
                      ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                      : "bg-transparent border-[#D4AF37]/30 text-[#D4AF37] hover:border-[#D4AF37]"
                  }`}
                >
                  {showSkeleton ? "Hide Pose" : "Show Pose"}
                </button>
                <button
                  onClick={onRequestReset}
                  className="py-3 px-4 md:px-6 bg-transparent border border-[#D4AF37]/30 text-[#D4AF37] hover:border-[#D4AF37] transition text-sm"
                  title="Reset camera"
                >
                  <RotateCcw size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#2D2A26] border border-[#D4AF37]/20 p-6 rounded-lg h-fit sticky top-8">
            <h3 className="text-sm tracking-[3px] uppercase text-[#D4AF37] mb-4 font-bold">
              Select Shirt
            </h3>

            <div className="space-y-2 mb-8">
              {Object.entries(SHIRT_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => setSelectedShirt(key)}
                  className={`w-full text-left p-4 text-sm transition-all border rounded ${
                    selectedShirt === key
                      ? "bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]"
                      : "bg-transparent border-[#D4AF37]/20 text-[#FAF9F6]/70 hover:border-[#D4AF37]"
                  }`}
                >
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-xs text-[#FAF9F6]/50 mt-1">{key}</div>
                </button>
              ))}
            </div>

            <div className="pt-6 border-t border-[#D4AF37]/20">
              <p className="text-[10px] text-[#FAF9F6]/60 leading-relaxed space-y-2">
                <span className="block font-bold text-[#D4AF37] mb-2">
                  💡 Tips for Best Results:
                </span>
                <span className="block">✓ Stand 2-3 feet away</span>
                <span className="block">✓ Face straight at camera</span>
                <span className="block">✓ Keep arms visible</span>
                <span className="block">✓ Good lighting helps</span>
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={goBack}
                className="w-full bg-[#D4AF37] text-black py-3 text-sm tracking-widest uppercase font-medium hover:opacity-90 transition rounded"
              >
                Continue
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full border border-[#D4AF37]/30 text-[#D4AF37] py-3 text-sm tracking-widest uppercase hover:border-[#D4AF37] transition rounded"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function VirtualTryOnPreview() {
  const { id } = useParams<{ id: string }>();
  const [resetKey, setResetKey] = useState(0);

  const initialShirt = id && SHIRT_PRESETS[id] ? id : "oxford-white";

  const handleRequestReset = () => {
    setResetKey((k) => k + 1);
  };

  return (
    <TryOnSession
      key={resetKey}
      initialShirt={initialShirt}
      onRequestReset={handleRequestReset}
    />
  );
}

export { SHIRT_PRESETS };
