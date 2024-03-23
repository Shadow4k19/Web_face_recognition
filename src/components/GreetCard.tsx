import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Image } from "react-bootstrap";

const GreetCard = ({ person }: { person: any }) => {
  const { emotion, name, text,path } = person;
  const img_path = "http://127.0.0.1:8000/static/img";
  return (
    <Card className="m-3">
      <Row>
        <Col xs={"auto"}>
          <Card.Img src={img_path + path} className="avatar rounded" />
        </Col>
        <Col>
          <Card.Body>
            <Card.Text>{text}</Card.Text>
            <Image
              src={`./images/moods/${emotion}.png`}
              className="mood position-absolute bottom-0 end-0 m-2"
            />
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default GreetCard;
