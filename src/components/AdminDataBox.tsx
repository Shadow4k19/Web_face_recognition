import React, { useState } from "react";
import { Container, Form, Button, Modal, Row, Col } from "react-bootstrap";
export default function AdminDataBox() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState({
    Password: "",
    Name: "",
    Role: "admin",
  });
  const handleChange = (field: string, value: any) => {
    setData({
      ...data,
      [field]: value,
    });
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, data }),
      });
      const responseData = await response.json();
      if (response.ok) {
        alert("User has create");
        window.location.href = "/admin";
      } else {
        alert(responseData.error);
        console.log(responseData.error);
      }
    } catch (error) {
      alert(error);
    }
  };
  return (
    <Form onSubmit={handleSubmit} className="position-relative">
      <Container>
        <Row>
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
        </Row>
        <Row>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={data.Password}
              onChange={(e) => handleChange("Password", e.target.value)}
            />
          </Form.Group>
        </Row>
        <Row>
          <Form.Group controlId="Name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name"
              value={data.Name}
              onChange={(e) => handleChange("Name", e.target.value)}
            />
          </Form.Group>
        </Row>
        <Row className="mt-3">
          <Form.Group controlId="role">
            <Form.Label>Role</Form.Label>
            <Form.Control
              type="text"
              placeholder="role"
              value={data.Role}
              onChange={(e) => handleChange("Role", e.target.value)}
              disabled
            />
          </Form.Group>
        </Row>
        <Row className="mt-5 text-center">
          <Col className="text-center">
            <Button variant="primary" type="submit" onClick={handleSubmit}>
              Submit
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  );
}
