import React, { useState, useEffect } from "react";
import { Container, Form, Button, Modal, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";

export default function MessageEdit() {
  const [msg, setMsg] = useState("");
  const [type, setType] = useState("All");
  const [error, setError] = useState("");
  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/text-mood/?id=${id}`,
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
          setMsg(data[0].mood_text);
          setType(data[0].mood_type);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  const handleSave = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/text-mood/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mood_text: msg, mood_type: type, id: id }),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log("Update successful");
        alert("Update successful");
        window.location.href = "/setting";
      } else {
        console.error("Update failed");
        alert("Update failed");
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
        <h1 className="display-4">Message Edit</h1>
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
            <option value="Disgust">Disgust</option>
            <option value="Fear">Fear</option>
            <option value="Surprise">Surprise</option>
            <option value="Happy">Happy</option>
            <option value="Angry">Angry</option>
            <option value="Sad">Sad</option>
            <option value="">All</option>
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
            className="mt-3 float-end"
            type="submit"
            onClick={handleSave}
          >
            Save
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
