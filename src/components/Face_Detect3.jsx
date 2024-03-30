import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Container, Row } from "react-bootstrap";
import GreetCard from "../components/GreetCard";
import pixelmatch from "pixelmatch";

const WebcamComponent = () => {
  const videoRef = useRef(null);
  const prevCanvasRef = useRef(null);
  const [datamap, setDatamap] = useState([]);
  const canSendRequest = useRef(true);
  const canvas = document.createElement("canvas");
  const timeoutRef = useRef(null);

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
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const displaySize = {
          width: video.videoWidth,
          height: video.videoHeight,
        };
        document.body.append(canvas)
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
          if (detections.length > 0 && canSendRequest.current) {
            await saveAndSendImage(video);
            canSendRequest.current = false;
            if (canSendRequest.current === false) {
              Change();
            }
          }else{
            timeoutRef.current = setTimeout(() => {
              prevCanvasRef.current = null;
              canSendRequest.current = false
              if (canSendRequest.current === false) {
                Change();
              }
            }, 3000);
          }
        }, 3000);
        const Change = () => {
          setTimeout(() => {
            //console.log("Change");
            canSendRequest.current = true;
          }, 3000);
        };
      }
    };

    const saveAndSendImage = async (video) => {
      if (video) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const { videoWidth, videoHeight } = video;

        canvas.width = videoWidth;
        canvas.height = videoHeight;
        context.drawImage(video, 0, 0, videoWidth, videoHeight);

        const blob = await new Promise((resolve) => {
          canvas.toBlob((blob) => {
            resolve(blob);
          }, "image/png");
        });

        const date = new Date().toISOString().split("T")[0];
        const time = new Date().toISOString().split("T")[1].split(".")[0];
        const formattedTime = time.replace(/[:\-]/g, "-");
        const fileName = `img-${date}-${formattedTime}.png`;

        const file = new File([blob], fileName, { type: "image/png" });

        const formData = new FormData();
        formData.append("image", file);

        let similarityScore = 0;

        const prevBlob = prevCanvasRef.current;

        if (prevBlob) {
          similarityScore = await calculateImageSimilarity(blob, prevBlob);
          console.log("Similarity Score:", similarityScore);
        }

        if (similarityScore >= 0.7) {
          return;
        } else {
          const fetchData = async () => {
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
                  const data = await response.json();
                  if (data) {
                    /*setDatamap(prevDatamap => {
                      const newDatamap = [...prevDatamap, ...data.result];
                      console.log(newDatamap)
                      if (newDatamap.length > 3) {
                        // let x = datamap.length - 3
                        return newDatamap.slice(datamap.length - 3);
                      } else {
                        return newDatamap;
                      }
                      //setDatamap(data.result)
                    });*/
                    setDatamap(data.result)
                  }
                } else {
                 /* const errorData = await response.json();
                  console.error(errorData.error);
                  console.error("Failed to send image to the backend");*/
                }
              } catch (error) {
                console.error("Error sending image to the backend:", error);
              }
            }
          };
          fetchData();
          prevCanvasRef.current = blob;
        }
      }
    };

    const calculateImageSimilarity = async (currentBlob, prevBlob) => {
      const currentCanvas = document.createElement("canvas");
      const currentContext = currentCanvas.getContext("2d");

      const prevCanvas = document.createElement("canvas");
      const prevContext = prevCanvas.getContext("2d");

      const currentImage = new Image();
      const prevImage = new Image();

      currentImage.src = URL.createObjectURL(currentBlob);
      prevImage.src = URL.createObjectURL(prevBlob);

      await Promise.all([
        new Promise((resolve) => (currentImage.onload = resolve)),
        new Promise((resolve) => (prevImage.onload = resolve)),
      ]);

      currentCanvas.width = currentImage.width;
      currentCanvas.height = currentImage.height;

      prevCanvas.width = prevImage.width;
      prevCanvas.height = prevImage.height;

      currentContext.drawImage(currentImage, 0, 0);
      prevContext.drawImage(prevImage, 0, 0);

      const diff = pixelmatch(
        currentContext.getImageData(
          0,
          0,
          currentCanvas.width,
          currentCanvas.height
        ).data,
        prevContext.getImageData(0, 0, prevCanvas.width, prevCanvas.height)
          .data,
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
    return () => {
      if (canvas && canvas.parentElement === document.body) {
        document.body.removeChild(canvas);
      }
    };
  }, []);
  //console.log(datamap)
  useEffect(() => {}, [datamap]);
  return (
    <div id="detect-container" className="body-detect">
      <video ref={videoRef} autoPlay playsInline muted />
      <canvas id="canvas" />
      <Row>
        <Container className="container-card">
          {datamap.length > 0 ? (
            datamap.reverse().map((person, index) => (
              <GreetCard 
              person={person} 
              key={index}
            />
            ))
          ) : (
            <p></p>
          )}
        </Container>
      </Row>
    </div>
  );
};

export default WebcamComponent;
