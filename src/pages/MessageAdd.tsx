import React, { useState } from "react";
import { Container, Form, Button, Modal, Row, Col } from "react-bootstrap";

export default function MessageAdd() {
  const [msg, setMsg] = useState("");
  const [type, setType] = useState("All");
  const [error, setError] = useState("");

  const handleSave = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/text-mood/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mood_text: msg, mood_type: type }),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log("Add successful");
        alert("Add successful");
        window.location.href = "/setting";
      } else {
        console.error("Add failed");
        alert("Add failed");
        setError(responseData.message);
        console.log(error);
      }
    } catch (error) {
      console.error(error);
      alert("Error occurred. Please try again.");
    }
  };
  return (
    <Container>
      <Row>
        <h1 className="display-4">Message Add</h1>
      </Row>
      <Row>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Message</Form.Label>
          <Form.Control
            type="text"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="surname">
          <Form.Label>Types</Form.Label>
          <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Happy">Happy</option>
            <option value="Angry">Angry</option>
            <option value="Sad">Sad</option>
            <option value="All">All</option>
          </Form.Select>
        </Form.Group>
      </Row>
      <Row>
        <p>show message</p>
        <p className="ms-3">{msg}</p>
        <p>show message type</p>
        <p className="ms-3">{type}</p>
      </Row>
      <Row>
        <Col>
          <Button
            variant="primary"
            className="mt-3"
            type="submit"
            onClick={handleSave}
          >
            Add
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
