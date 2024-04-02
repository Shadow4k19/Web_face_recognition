import React, { useState } from "react";
import { Card, Col, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

interface MessageCardProps {
  id: number;
  mood: string;
  message: string;
  onEdit?: (id: number) => void;
  onDelete?: () => void;
}
export default function MessageCard({
  id,
  mood,
  message,
  onEdit,
  onDelete,
}: MessageCardProps) {
  const [error, setError] = useState("");
  const handleEdit = () => {
    if (onEdit) {
      onEdit(id);
    }
  };
  const handleDelete = async () => {
    try {
      const isConfirm = window.confirm(`Are you sure to Delete ${message}`);
      if (isConfirm) {
        const response = await fetch("http://127.0.0.1:8000/api/text-mood/", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id }),
        });
        const responseData = await response.json();
        console.log(responseData);
        if (response.ok) {
          console.log("Delete successful");
          alert("Delete successful");
          window.location.href = "/setting";
        } else {
          console.error("Delete failed");
          alert("Delete failed");
          setError(responseData.message);
          console.log(error);
        }
      }
    } catch (error) {
      console.error(error);
      alert("Error occurred. Please try again.");
    }
  };
  return (
    <Card>
      <Card.Header>
        <Row>
          <Col className="d-flex align-items-center p-0">
            <Card.Title className="text-start mt-auto mt-0 p-2">{mood}</Card.Title>
          </Col>
          <Col className="text-end">
            <Link to={`/text/edit/${id}`}>
              <Button onClick={handleEdit} variant="primary" className="m-2">
                Edit
              </Button>
            </Link>
            <Button onClick={handleDelete} variant="danger">
              Delete
            </Button>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <Card.Text>{message}</Card.Text>
      </Card.Body>
    </Card>
  );
}
