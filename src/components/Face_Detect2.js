import { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import styled from "styled-components";

const FaceDetectionComponent = () => {
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  let imageCounter = 1; // Counter for image names

  const StyledBody = styled.body`
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 10%;
    overflow: hidden;
  `;

  const StyledContainerFace = styled.div`
    position: relative;
  `;

  const StyledVideo = styled.video`
    width: 100%;
    height: auto;
    max-width: 1080px;
    max-height: 720px;
  `;

  const StyledRectangleOverlay = styled.div`
    position: absolute;
    box-sizing: border-box;
    pointer-events: none;
    border: 2px solid red;
  `;

  useEffect(() => {
    const setupFaceDetection = async () => {
      if (videoRef.current) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {},
          });

          videoRef.current.srcObject = stream;

          videoRef.current.addEventListener("loadeddata", async () => {
            const canvas = faceapi.createCanvasFromMedia(videoRef.current);
            const container = document.getElementById("canvas-container");
            if (container && !container.querySelector("canvas")) {
              container.appendChild(canvas);
            }

            const displaySize = {
              width: videoRef.current?.videoWidth || 0,
              height: videoRef.current?.videoHeight || 0,
            };
            faceapi.matchDimensions(canvas, displaySize);

            await Promise.all([
              faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
            ]);

            const draw = async () => {
              try {
                const detections = await faceapi.detectAllFaces(
                  videoRef.current,
                  new faceapi.TinyFaceDetectorOptions()
                );

                const resizedDetections = faceapi.resizeResults(
                  detections,
                  displaySize
                );
                if (overlayRef.current && resizedDetections.length > 0) {
                  const detection = resizedDetections[0];
                  overlayRef.current.style.left = detection.box.x + "px";
                  overlayRef.current.style.top = detection.box.y + "px";
                  overlayRef.current.style.width = detection.box.width + "px";
                  overlayRef.current.style.height = detection.box.height + "px";

                  const imageDataUrl = canvas.toDataURL("image/jpeg");
                  const blob = await (await fetch(imageDataUrl)).blob();
                  const file = new File([blob], `${imageCounter}.jpg`, {
                    type: "image/jpeg",
                  });

                  const formData = new FormData();
                  formData.append("image", file);

                  fetch("http://127.0.0.1:8000/api/face_recognition/", {
                    method: "POST",
                    body: formData,
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      console.log(data);
                    })
                    .catch((error) => {
                      console.error("Error sending image to backend:", error);
                    });
                  imageCounter++;
                }
              } catch (error) {
                console.error("Error during face detection:", error);
              }
              requestAnimationFrame(draw);
            };

            draw();
          });
        } catch (error) {
          console.error("Error accessing webcam:", error);
        }
      }
    };

    setupFaceDetection();

    return () => {
      const video = videoRef.current;
      if (video) {
        const stream = video.srcObject;
        const tracks = stream?.getTracks();
        tracks?.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <StyledBody>
      <StyledContainerFace>
        <StyledVideo
          id="webcamVideo"
          ref={videoRef}
          autoPlay
          muted
        ></StyledVideo>
        <StyledRectangleOverlay ref={overlayRef}></StyledRectangleOverlay>
      </StyledContainerFace>
    </StyledBody>
  );
};

export default FaceDetectionComponent;
