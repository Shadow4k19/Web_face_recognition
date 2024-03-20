import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Modal,
  Table,
} from "react-bootstrap";
import { UserInfo } from "../types/UserInfo";
import ModalSuccess from "../components/ModalSuccess";
import { time } from "console";

interface dataserch {
  id: number;
  Eng_name: string;
  time: string;
  big_img_path: string;
  small_img_path: string;
  date: string;
  mood_type: string;
}

export default function UserManagementSearch({
  searchFunction,
}: {
  searchFunction: (name: string) => UserInfo;
}) {
  const img_path = "http://127.0.0.1:8000/static/img";
  const initialData: dataserch[] = [];
  const [fetchData, setFetchdata] = useState(initialData);
  const imagePath = "./images/userImage.jpg";
  const [user, setUser] = useState<UserInfo | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [view, setView] = useState("card"); // 'card' or 'table'
  const [EN_name, setENname] = useState("");
  const [time_start, setTimestart] = useState("");
  const [time_end, setTimeEnd] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImage(file !== undefined ? file : null);
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("Eng_name", EN_name);
    formData.append("time_start", time_start);
    formData.append("time_end", time_end);
    formData.append("date", date);
    if (image) {
      formData.append("image", image);
    } else {
      formData.append("image", "");
    }
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/face-detect/`, {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();
      if (response.ok) {
        setUser(searchFunction(imagePath));
        setFetchdata(responseData);
        console.log(fetchData);
      } else {
        alert("Not Found");
      }
    } catch (error) {
      console.log(error);
      alert("Fail to fetch");
    }
  };

  const handleDelete = () => {
    setUser(null);
    setShowModal(false);
    setShowSuccessDialog(true);
  };

  const handleConfirm = () => {
    setShowSuccessDialog(false);
  };

  return (
    <Container>
      <Row>
        <h1 className="display-4">Search user</h1>
      </Row>
      <Row>
        <Form onSubmit={handleSearch}>
          <Form.Group controlId="searchInput">
            <Form.Label>Name and Surname</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name and surname"
              value={EN_name}
              onChange={(e) => setENname(e.target.value)}
            />
          </Form.Group>
          <Row className="mt-4">
            <Col>
              <Form.Group controlId="time_start">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="time_start">
                <Form.Label>Time start</Form.Label>
                <Form.Control
                  type="time"
                  value={time_start}
                  onChange={(e) => setTimestart(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="time_end">
                <Form.Label>Time end</Form.Label>
                <Form.Control
                  type="time"
                  value={time_end}
                  onChange={(e) => setTimeEnd(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Col>
            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} />
            </Form.Group>
          </Col>
          <Row className="my-4">
            <Col className="text-end">
              <Button variant="primary" type="submit">
                Search
              </Button>
            </Col>
          </Row>
        </Form>
      </Row>
      <Row>
        <Col className="text-start">
          <Button
            variant={view === "card" ? "secondary" : "light"}
            onClick={() => setView("card")}
          >
            Card View
          </Button>
          <Button
            variant={view === "table" ? "secondary" : "light"}
            onClick={() => setView("table")}
          >
            Table View
          </Button>
        </Col>
      </Row>
      <Row>
        {view === "table" && user && (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Full image</th>
                <th>EN_surname</th>
                <th>time</th>
                <th>date</th>
                <th>Emotion</th>
              </tr>
            </thead>
            <tbody>
              {fetchData.map((userData: any) => (
                <tr key={userData.id}>
                  <td>
                    <img
                      src={img_path + userData.small_img_path}
                      className="management-icon"
                      alt="user"
                    />
                  </td>
                  <td>
                    <img
                      src={img_path + userData.big_img_path}
                      className="management-icon"
                      alt=""
                    />
                  </td>
                  <td>{userData.Eng_name}</td>
                  <td>{userData.time}</td>
                  <td>{userData.date}</td>
                  <td>{userData.mood_type}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {view === "card" && user && (
          <Container>
            <Row>
              {fetchData.map((userData) => (
                <Card key={userData.id} className="text-center">
                  <Card.Header className="p-2">
                    <Card.Img
                      src={img_path + userData.small_img_path}
                      variant="top"
                      className="management-icon"
                    />
                    <Card.Img
                      src={img_path + userData.big_img_path}
                      variant="top"
                      className="management-icon"
                    />
                  </Card.Header>
                  <Card.Body>
                    <Card.Title>{userData.Eng_name}</Card.Title>
                    <Card.Title>{userData.time}</Card.Title>
                    <Card.Title>{userData.date}</Card.Title>
                    <Card.Title>{userData.mood_type}</Card.Title>
                  </Card.Body>
                </Card>
              ))}
            </Row>
          </Container>
        )}
      </Row>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <ModalSuccess
        onClose={() => setShowSuccessDialog(false)}
        show={showSuccessDialog}
        title="Delete Success"
      ></ModalSuccess>
    </Container>
  );
}
