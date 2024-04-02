import React, { useState } from "react";
import { Container, Row, Tab, Tabs } from "react-bootstrap";
import BackButton from "../components/BackButton";
//import MessageSetting from './MessageSetting'
import MessageAdd from "./MessageAdd";
import MessageSearch from "./MessageSearch";

export default function Setting() {
  const [activeTab, setActiveTab] = useState("MessageAdd");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <Container className="container-all">
      <Row>
        <Tabs
          id="setting"
          activeKey={activeTab}
          onSelect={(key) => handleTabChange(key ?? "")}
        >
          <Tab eventKey="MessageAdd" title="Message Add" className="p-2">
            <MessageAdd />
          </Tab>
          <Tab eventKey="MessageSearch" title="Message search" className="p-2">
            <MessageSearch
              onEdit={() => {
                handleTabChange("MessageSetting");
              }}
            ></MessageSearch>
          </Tab>
        </Tabs>
      </Row>
    </Container>
  );
}
