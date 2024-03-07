import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

const WebcamComponent = () => {
  const videoRef = useRef(null);

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

          if (detections.length > 0) {
            const imageBlob = await canvas.toDataURL("image/jpeg");
            saveAndSendImage(imageBlob);
          }
        }, 100);
      }
    };

    const saveAndSendImage = async (imageBlob) => {
      const blob = await fetch(imageBlob).then((res) => res.blob());

      const formData = new FormData();
      formData.append("image", blob, "img.jpg");
      /*
      if (formData) {
        try {
          const response = await fetch(
            "http://127.0.0.1:8000/api/face_recognition/",
            {
              method: "POST",
              body: formData,
            }
          );
          if (response.ok) {
            console.log("Image sent to the backend successfully.");
          } else {
            const errorData = await response.json();
            console.error(errorData.error);
            console.error("Failed to send image to the backend.");
          }
        } catch (error) {
          console.error("Error sending image to the backend:", error);
        }
      }*/
    };

    loadModels();
    detectAndDraw();
    return () => {};
  }, []);

  return (
    <div className="body-detect">
      <video ref={videoRef} autoPlay playsInline muted />
    </div>
  );
};

export default WebcamComponent;
