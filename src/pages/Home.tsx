import React from "react";
import { Container, Row } from "react-bootstrap";
import SettingButton from "../components/SettingButton";
import { PersonGreet } from "../types/PersonGreet";
import WebcamComponent from "../components/Face_Detect3";
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
      </Container>
      <SettingButton></SettingButton>
    </div>
  );
}
