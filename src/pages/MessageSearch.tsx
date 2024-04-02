import { useState } from "react";
import {
  Container,
  Form,
  Button,
  //Modal,
  Row,
  Col,
  //Card,
} from "react-bootstrap";
import MessageCard from "../components/MessageCard";

interface MessageSearchProps {
  onEdit?: () => void;
}
interface MessageData {
  id: number;
  mood_text: string;
  mood_type: string;
}

export default function MessageSearch({ onEdit }: MessageSearchProps) {
  const [msg, setMsg] = useState("");
  const [type, setType] = useState("All");
  const [error, setError] = useState("");
  const [data, setData] = useState<MessageData[]>([]);
  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/text-mood/?mood_text=${msg}&mood_type=${type}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        setData(responseData);
        console.log(data);
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
    <Container className="container-all">
      <Row>
        <h1 className="display-4">Message search</h1>
      </Row>
      <Row>
        <Form.Group className="mb-3">
          <Form.Label>Message</Form.Label>
          <Form.Control
            type="text"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
        </Form.Group>
      </Row>
      <Row>
        <Form.Group className="mb-3" controlId="surname">
          <Form.Label>Types</Form.Label>
          <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Disgust">Disgust</option>
            <option value="Fear">Fear</option>
            <option value="Surprise">Surprise</option>
            <option value="Neutral">Neutral</option>
            <option value="Happy">Happy</option>
            <option value="Angry">Angry</option>
            <option value="Sad">Sad</option>
            <option value="All">All</option>
          </Form.Select>
        </Form.Group>
      </Row>
      <Row>
        <Col className="text-center mt-3">
          <Button variant="primary" onClick={handleSearch}>
            search
          </Button>
        </Col>
      </Row>
      <Row className="mt-4">
        {data.map((item, index) => (
          <Col key={index} sm={6} className="mb-4">
            <MessageCard
              id={item.id}
              mood={item.mood_type}
              message={item.mood_text}
              onEdit={onEdit}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
