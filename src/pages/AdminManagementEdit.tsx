import React from "react";
import AdminManagementAdd from "./AdminManagementAdd";
import { Container, Form, Button, Modal, Row, Col } from "react-bootstrap";
import AdminDataBox from "../components/AdminDataBoxEdit";

export default function AdminManagementEdit() {
  return (
    <Container>
      <h1 className="display-4">Edit Admin</h1>
      <AdminDataBox />
    </Container>
  );
}
