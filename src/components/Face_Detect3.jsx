import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import pixelmatch from "pixelmatch";

const WebcamComponent = () => {
  const videoRef = useRef(null);
  const prevCanvasRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ]);
      startVideo();
    };

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => (videoRef.current.srcObject = stream))
        .catch((err) => console.error(err));
    };

    const detectAndDraw = async () => {
      let canSendRequest = true;

      if (videoRef.current) {
        const video = videoRef.current;
        await new Promise((resolve) => {
          video.addEventListener("loadeddata", resolve, { once: true });
        });
        const canvas = faceapi.createCanvasFromMedia(video);
        document.body.append(canvas);
        const displaySize = {
          width: video.videoWidth,
          height: video.videoHeight,
        };
        faceapi.matchDimensions(canvas, displaySize);

        setInterval(async () => {
          const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions();

          const resizedDetections = faceapi.resizeResults(
            detections,
            displaySize
          );
          canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizedDetections);

          if (detections.length > 0 && canSendRequest) {
            saveAndSendImage(canvas);
            canSendRequest = false;
            setTimeout(() => {
              canSendRequest = true;
            }, 1000);
          }
        }, 1000);
      }
    };

    const saveAndSendImage = async (canvas) => {
      if (canvas) {
        const Image = canvas.toDataURL("image/jpeg");
        //console.log(Image);
        const date = new Date().toISOString().split("T")[0];
        const time = new Date().toISOString().split("T")[1].split(".")[0];
        let times = time.replace(/[:\-]/g, "-");
        const SaveImage = new File([Image], `img-${date}-${times}.jpg`, {
          type: "image/jpeg",
        });

        const formData = new FormData();
        formData.append("image", SaveImage);
        const prevCanvas = prevCanvasRef.current;

        if (prevCanvas) {
          const similarityScore = await calculateImageSimilarity(
            canvas,
            prevCanvas
          );
          if (similarityScore >= 0.9) {
            return;
          }
        } else {
          if (SaveImage) {
            console.log("Have image");
            try {
              const response = await fetch(
                "http://127.0.0.1:8000/api/face_recognition/",
                {
                  method: "POST",
                  /*headers: {
                    "Content-Type": "application/json",
                    // Add other headers if needed
                  },*/
                  body: formData,
                }
              );

              if (response.ok) {
                console.log("Image sent to the backend successfully");
              } else {
                const errorData = await response.json();
                console.error(errorData.error);
                console.error("Failed to send image to the backend");
              }
            } catch (error) {
              console.error("Error sending image to the backend:", error);
            }
          }

          prevCanvasRef.current = canvas;
        }
      }
    };
    const calculateImageSimilarity = async (currentCanvas, prevCanvas) => {
      const diff = pixelmatch(
        currentCanvas
          .getContext("2d")
          .getImageData(0, 0, currentCanvas.width, currentCanvas.height).data,
        prevCanvas
          .getContext("2d")
          .getImageData(0, 0, prevCanvas.width, prevCanvas.height).data,
        null,
        currentCanvas.width,
        currentCanvas.height,
        { threshold: 0.1 }
      );
      const totalPixels = currentCanvas.width * currentCanvas.height;
      const similarityScore = 1 - diff / totalPixels;
      return similarityScore;
    };

    loadModels();
    detectAndDraw();
    return () => {};
  }, []);

  return (
    <div className="body-detect">
      <canvas></canvas>
      <video ref={videoRef} autoPlay playsInline muted />
    </div>
  );
};

export default WebcamComponent;
