import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import ReactCrop from "react-easy-crop";
import { Area, Point } from "react-easy-crop/types";
import getCroppedImg from "../utils/cropper";
import ModalSuccess from "../components/ModalSuccess";
import { useParams } from "react-router-dom";

export default function UserManagementEdit() {
  const [TH_name, setTHName] = useState("");
  const [EN_name, setENName] = useState("");
  const [imgpath, setPath] = useState("");
  const [image, setImage] = useState("");
  const { id } = useParams();
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      const blob = await fetch(croppedImage).then((res) => res.blob());
      const croppedFile = new File([blob], `${EN_name}.jpg`, {
        type: "image/jpg",
      });
      if (id) {
        formData.append("id", id);
      }
      formData.append("TH_name", TH_name);
      formData.append("Eng_name", EN_name);
      formData.append("Folder_img_path", imgpath);
      formData.append("image", croppedFile);

      const response = await fetch(`http://127.0.0.1:8000/api/users/`, {
        method: "PUT",
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        setShowModal(true);
      } else {
        alert(responseData.error);
        console.log(responseData.error);
      }
    } catch (error) {
      alert(error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    window.location.href = "/user";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/users/?id=${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        } else {
          const data = await response.json();
          console.log(data);
          setTHName(data[0].TH_name);
          setENName(data[0].Eng_name);
          setPath(data[0].Folder_img_path);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <Container>
      <h1 className="display-4">Edit User</h1>
      <Form onSubmit={handleSubmit} className="position-relative">
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
        <Button type="submit" variant="primary" className="mt-3 float-end">
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
