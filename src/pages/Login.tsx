import React, { useState } from "react";
import {
  Container,
  Row,
  Image,
  Form,
  Button,
  Col,
  Alert,
} from "react-bootstrap";
import MyNav from "../components/MyNav";

export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: any) => {
    event.preventDefault();

    const username = event.target.elements.username.value;
    const password = event.target.elements.password.value;

    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log("Login successful");
        alert("Login successful");
        window.location.href = "/manage";
      } else {
        console.error("Login failed");
        alert("Login failed");
        setError(responseData.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row>
        <Container className="p-5">
          <Row className="d-flex justify-content-center align-items-center">
            <Image
              src="./images/loginImage.jpg"
              className="account rounded-circle border border-dark"
              fluid
            />
          </Row>
          <Row>
            <Form onSubmit={handleLogin}>
              <Container>
                <Row>
                  <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                  </Form.Group>
                </Row>
                <Row className="mt-5 text-center">
                  <Col className="text-center">
                    <Button variant="danger" type="submit" disabled={loading}>
                      {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                    </Button>
                  </Col>
                </Row>
                {error && (
                  <Row className="mt-3">
                    <Col className="text-center">
                      <Alert variant="danger">{error}</Alert>
                    </Col>
                  </Row>
                )}
              </Container>
            </Form>
          </Row>
        </Container>
      </Row>
    </Container>
  );
}
