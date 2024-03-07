import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

interface User {
  id: number;
  Username: string;
  Password: string;
  Name: string;
  Role: string;
}

export default function AdminManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (Username: string) => {
    navigate("/admin/edit/" + Username);
  };

  const handleDelete = async (id: number) => {
    try {
      const isConfirmed = window.confirm("Are you sure you want to delete?");
      if (isConfirmed) {
        const response = await fetch(`http://127.0.0.1:8000/api/admin/`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id }),
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log(responseData);

          if (responseData.message === "Delete Complete") {
            alert("Delete Complete");
            window.location.href = "/admin";
          } else {
            alert(responseData.error);
          }
        } else {
          console.log("User canceled delete.");
        }
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSearch = () => {
    if (search.trim() === "") {
      fetchData();
    } else {
      const filteredUsers = users.filter((user) =>
        user.Name.toLowerCase().includes(search.toLowerCase())
      );
      setUsers(filteredUsers);
    }
  };

  return (
    <Container>
      <Row>
        <h1 className="display-6">Admin management</h1>
      </Row>
      <Row className="bg-light">
        <Row className="justify-content-end">
          <Col className="d-flex align-items-center">
            <Form.Control
              type="text"
              placeholder="Search by Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button className="ms-2" onClick={handleSearch}>
              Search
            </Button>
            <Button className="ms-2" onClick={() => navigate("/admin/add")}>
              Add
            </Button>
          </Col>
        </Row>
      </Row>
      <Row>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Password</th>
              <th>Name</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.Username}</td>
                <td>{user.Password}</td>
                <td>{user.Name}</td>
                <td>{user.Role}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleEdit(user.Username)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
      <BackButton></BackButton>
    </Container>
  );
}
