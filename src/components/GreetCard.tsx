import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Image } from "react-bootstrap";

const GreetCard = ({ person }: { person: any }) => {
  const { emotion, name, text, path ,useTts} = person;
  const img_path = "http://127.0.0.1:8000/static/img";

  useEffect(() => {
    if(useTts === false){
    const socket = new WebSocket("ws://localhost:8765");

    socket.onopen = () => {
      //console.log('WebSocket connection established');
      
      const message = JSON.stringify(text);
      socket.send(message);
    };

    socket.onerror = (error) => {
      //console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();
    };
  }
  }, [text]);


  return (
    <Container className="container-greet">
    <Card className="m-3 greet-card">
      <Row>
        <Col xs={"auto"}>
          <Card.Img src={img_path + path} className="avatar rounded card-img" />
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
    </Container>
  );
};

export default GreetCard;
