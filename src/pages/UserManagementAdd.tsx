import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import ReactCrop from "react-easy-crop";
import { Area, Point } from "react-easy-crop/types";
import getCroppedImg from "../utils/cropper";
import ModalSuccess from "../components/ModalSuccess";

export default function UserManagementAdd() {
  const [TH_name, setTHName] = useState("");
  const [EN_name, setENName] = useState("");
  const [image, setImage] = useState("");
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>({
    ...crop,
    width: 0,
    height: 0,
  });
  const [zoom, setZoom] = useState(1);
  const [cropped, setCropped] = useState(false);
  const [croppedImage, setCroppedImage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleTHNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTHName(event.target.value);
  };

  const handleENNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setENName(event.target.value);
  };

  const handleCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleClearCropped = () => {
    setCropped(false);
    setCroppedImage("");
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        handleClearCropped();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinishCropping = async () => {
    const croppedImageStr = await getCroppedImg(image, croppedAreaPixels, zoom);
    setCroppedImage(croppedImageStr ?? "");
    setCropped(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (TH_name !== "" && EN_name !== "" && croppedImage !== "") {
        const blob = await fetch(croppedImage).then((res) => res.blob());
        const croppedFile = new File([blob], `${EN_name}.jpg`, {
          type: "image/jpg",
        });
        const formData = new FormData();
        formData.append("TH_name", TH_name);
        formData.append("Eng_name", EN_name);
        formData.append("img", croppedFile);

        const response = await fetch("http://127.0.0.1:8000/api/users/", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          setShowModal(true);
          setTHName("");
          setENName("");
          handleClearCropped();
        } else {
          console.error("Save failed");
          alert("Save failed");
        }
      } else {
        alert("Some or all inputs are empty");
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    window.location.href = "/user";
  };

  return (
    <Container>
      <h1 className="display-4">Add User</h1>
      <Form className="position-relative" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Thai Name:</Form.Label>
          <Form.Control
            type="text"
            value={TH_name}
            onChange={handleTHNameChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>English Name:</Form.Label>
          <Form.Control
            type="text"
            value={EN_name}
            onChange={handleENNameChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="image">
          <Form.Label>Image:</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </Form.Group>
        {croppedImage && (
          <>
            <img src={croppedImage} alt="Cropped" />
            <br></br>
          </>
        )}
        <Button type="submit" variant="primary" className="mt-3">
          Save
        </Button>
        {cropped && (
          <Button
            variant="danger float-end"
            className="mt-3"
            onClick={handleClearCropped}
          >
            Recrop
          </Button>
        )}

        {image && !cropped && (
          <ReactCrop
            image={image}
            crop={crop}
            zoom={zoom}
            onZoomChange={setZoom}
            onCropChange={setCrop}
            onCropComplete={handleCropComplete}
          />
        )}
      </Form>
      {image && !cropped && (
        <Button onClick={handleFinishCropping}>FINISH</Button>
      )}

      <ModalSuccess
        show={showModal}
        onClose={handleCloseModal}
        title="Save success"
      ></ModalSuccess>
    </Container>
  );
}
