import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import GreetCard from "../components/GreetCard";
import SettingButton from "../components/SettingButton";
import { PersonGreet } from "../types/PersonGreet";
//import FaceDetectionComponent from '../components/face_detect1';
import WebcamComponent from "../components/Face_Detect";
import "../components/Face_detect.css";

export default function Home({ persons }: { persons: PersonGreet[] }) {
  return (
    <div>
      <Container fluid={true} className="p-4">
        <Row className="text-center my-1">
          <h1 className="home-title display-4">
            <u>Hello World!</u>
          </h1>
        </Row>
        <Row>
          <WebcamComponent />
        </Row>
        <Row>
          <Container>
            {persons.map((person, index) => (
              <GreetCard person={person} key={index}></GreetCard>
            ))}
          </Container>
        </Row>
      </Container>
      <SettingButton></SettingButton>
    </div>
  );
}
