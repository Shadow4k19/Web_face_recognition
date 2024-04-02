import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";

export default function AdminDataBox() {
  const { user } = useParams();
  const [username, setUsername] = useState("");
  const [userdata, setUserData] = useState({
    Password: "",
    Name: "",
    Role: "admin",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/admin/?user=${user}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setUsername(data[0].Username);
          const { Username, ...rest } = data[0];
          setUserData((prevInfo) => ({
            ...prevInfo,
            ...rest,
          }));
        } else {
          console.log("error");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user]);

  const handleChange = (field: string, value: any) => {
    setUserData({
      ...userdata,
      [field]: value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("DATA" + userdata);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Username: username, data: userdata }),
      });
      const responseData = await response.json();
      if (response.ok) {
        console.log(responseData);
        alert("Update Complete");
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
              value={userdata.Password}
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
              value={userdata.Name}
              onChange={(e) => handleChange("Name", e.target.value)}
            />
          </Form.Group>
        </Row>
        <Row className="mt-3">
          <Form.Group controlId="role">
            <Form.Label>Role</Form.Label>
            <Form.Control
              type="text"
              placeholder="Role"
              value={userdata.Role}
              onChange={(e) => handleChange("Role", e.target.value)}
              disabled
            />
          </Form.Group>
        </Row>
        <Row className="mt-5 text-center">
          <Col className="text-center">
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  );
}
