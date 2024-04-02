import React, { useEffect, useState } from "react";
import { Container, Row ,Form, Button, Tab, Tabs } from "react-bootstrap";
import SettingButton from "../components/SettingButton";
import { PersonGreet } from "../types/PersonGreet";
import WebcamComponent from "../components/Face_Detect3";
import "../components/Face_detect.css";
import user from '../components/User'
import { Link } from "react-router-dom";

export default function Settingall() {
  const [voice, setVoice] = useState("");
  const [volumn, setVolumn] = useState("0.9");
  const [rate, setRate] = useState("120");

  return (
    <div className="container-setting">
      <Container fluid={true} className="p-4">
        <Tabs defaultActiveKey="Setting" id="setting-tab" className="mb-3">
          <Tab eventKey="Setting" title="Setting" className="p-2">
            <Row className="text-center my-1">
              <Form.Group className="mb-3" controlId="Voice">
                <Form.Label>Voice</Form.Label>
                <Form.Select value={voice} onChange={(e) => setVoice(e.target.value)}>
                  <option value="TH">TH-TSS</option>
                </Form.Select>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group className="mb-3" controlId="volumn">
                <Form.Label>Volumn</Form.Label>
                <h5 className="float-end">{volumn}</h5>
                <input type="range" min="0" max="1" step="0.1" className="form-range" value={volumn} onChange={(e) => setVolumn(e.target.value)} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group className="mb-3" controlId="rate">
                <Form.Label>Rate</Form.Label>
                <h5 className="float-end">{rate}</h5>
                <input type="range" min="100" max="200" step="1" className="form-range" value={rate} onChange={(e) => setRate(e.target.value)} />
              </Form.Group>
            </Row>
            <Row className="container-message">
              <Button variant="primary" className="mb-2 btn-save-setting">Save Setting</Button>
            </Row>
            <Row>
              <Container className="container-message">
                <div className="message-setting">
                  <label>Message Setting</label>
                  <div className="btn-move">
                    <Link to ={"/message"}>
                    <Button variant="primary" className="mb-2 btn">Message Setting</Button>
                    </Link>
                  </div>
                </div>
              </Container>
            </Row>
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
}
