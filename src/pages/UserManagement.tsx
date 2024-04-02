import React from "react";
import { Container, Row, Tab, Tabs } from "react-bootstrap";
import UserManagementAdd from "./UserManagementAdd";
import UserManagementSearch from "./UserManagementSearch";
import BackButton from "../components/BackButton";
import UserSearch from "./UserSearch";

export default function UserManagement() {
  return (
    <Container className="container-all">
      <Row>
        <Tabs defaultActiveKey="addUser" id="uncontrolled-tab-example">
          <Tab eventKey="addUser" title="Add User" className="p-2">
            <UserManagementAdd></UserManagementAdd>
          </Tab>
          <Tab eventKey="searchUser" title="Search User" className="p-2">
            <UserManagementSearch
              searchFunction={(name: string) => ({
                avatarImage: "./images/userImage.jpg",
              })}
            ></UserManagementSearch>
          </Tab>
          <Tab eventKey="userSearch" title="User Search" className="p-2">
            <UserSearch />
          </Tab>
        </Tabs>
      </Row>
    </Container>
  );
}
