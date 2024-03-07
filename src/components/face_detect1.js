import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import styled from "styled-components";

const FaceDetectionComponent = () => {
  const webcamRef = useRef(null);
  const [emotion , setEmotion] = useState("");
  const [name , setName] = useState("");
  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const img = new Image();

    return new Promise((resolve) => {
      img.src = imageSrc;
      img.onload = () => resolve(img);
    });
  };

  const processAndSendImage = async (img) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = 320;
    canvas.height = 240;

    context.drawImage(img, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.8);
    });
  };

  const handleCapture = async () => {
    const img = await capture();
    const blob = await processAndSendImage(img);

    try {
      const formData = new FormData();
      formData.append("image", blob, "screenshot.jpg");

      const response = await fetch(
        "http://127.0.0.1:8000/api/face_recognition/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
    if (data.result.length === 0) {
      console.log("No result found");
    } else {
        console.log("Results:", data.result)
        setEmotion(data.emotion)
        setName(data.name)
        console.log("Name: "+name + " Emotion: " + emotion)
      }
    } catch (error) {
      console.error("Error sending image to Django:", error);
    }
  };

  return (
    <StyledContainer>
      <StyledVideo
        id="webcamVideo"
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
      />
      <StyledButton onClick={handleCapture}>Capture</StyledButton>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10%;
  height: 100vh;
`;

const StyledVideo = styled(Webcam)`
  max-width: 100%;
  max-height: 100%;
`;

const StyledButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`;

export default FaceDetectionComponent;
