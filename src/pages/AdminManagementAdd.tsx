import React from "react";
import { Container, Form, Button, Modal, Row, Col } from "react-bootstrap";
import AdminDataBox from "../components/AdminDataBox";

export default function AdminManagementAdd() {
  return (
    <Container className="container-all">
      <h1 className="display-4">Add Admin</h1>
      <AdminDataBox />
    </Container>
  );
}
