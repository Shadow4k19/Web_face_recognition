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
  const [showModal, setShowModal] = useState(false); // State variable for showing the success modal

  const handleTHNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTHName(event.target.value);
  };

  const handleENNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setENName(event.target.value);
  };

  const handleCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    // Perform any necessary logic with the cropped area
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleClearCropped = () => {
    setCropped(false);
    setCroppedImage("");
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    console.log(croppedAreaPixels);
    const croppedImageStr = await getCroppedImg(
      image,
      {
        x: croppedAreaPixels.x,
        y: croppedAreaPixels.y,
        width: croppedAreaPixels.width,
        height: croppedAreaPixels.height,
      },
      zoom
    );
    setCroppedImage(croppedImageStr ?? "");
    setCropped(true);
  };
  const handleSubmit = async () => {
    try {
      if (TH_name !== "" && EN_name !== "" && croppedImage !== "") {
        const blob = await fetch(`image/png;base64,${croppedImage}`).then(
          (res) => res.blob()
        );
        const date = new Date().toISOString().split("T")[0];
        const time = new Date().toISOString().split("T")[1].split(".")[0];
        let times = time.replace(/[:\-]/g, "-");
        const croppedFile = new File([blob], `${EN_name}${date}-${times}.jpg`, {
          type: "image/jpg",
        });
        const formData = new FormData();
        formData.append("TH_name", TH_name);
        formData.append("Eng_name", EN_name);
        formData.append("img", croppedFile);
        const fetchData = async () => {
          try {
            const response = await fetch("http://127.0.0.1:8000/api/users/", {
              method: "POST",
              body: formData,
            });
            const responseData = await response.json();
            console.log(responseData);
            if (response.ok) {
              setShowModal(true);
            } else {
              console.error("Save failed");
              console.log(responseData);
              alert("Save failed");
            }
          } catch (error) {
            console.log(error);
          }
        };
        fetchData();
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
  };
  return (
    <Container>
      <h1 className="display-4">Add User</h1>
      <Form className="position-relative">
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
        <Button
          type="submit"
          variant="primary"
          className="mt-3"
          onClick={handleSubmit}
        >
          Save
        </Button>
        {croppedImage && (
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
        <Button onClick={handleFinishCropping}>FINISH {cropped}</Button>
      )}

      {/* Success Modal */}
      <ModalSuccess
        show={showModal}
        onClose={handleCloseModal}
        title="Save success"
      ></ModalSuccess>
    </Container>
  );
}
