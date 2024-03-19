import React, { useState } from "react";
import { Container, Form, Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface Datafetch {
  id: number;
  Eng_name: string;
  TH_name: string;
  folder_path: string;
}

export default function UserSearch() {
  const [EN_name, setENName] = useState("");
  const [Error, setError] = useState("");
  const [data, setData] = useState<Datafetch[]>([]);
  const navigate = useNavigate();

  const handleENNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setENName(event.target.value);
  };

  const handleDelete = async (
    userId: number,
    Th_name: string,
    Eng_name: string
  ) => {
    const confirm = window.confirm(
      `Are you sure you want to delete ${Th_name}`
    );
    if (confirm) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/users/`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: userId, Eng_name: Eng_name }),
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log(responseData);

          if (responseData.message === "Delete Complete") {
            alert("Delete Complete");
            window.location.href = "/user";
          } else {
            alert(responseData.error);
          }
        } else {
          console.log("User canceled delete.");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/users/?Eng_name=${EN_name}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        setData(responseData);
      } else {
        console.error("Search failed");
        alert("Search failed");
        setError(responseData.message);
        console.log(Error);
      }
    } catch (error) {
      console.error(error);
      alert("Error occurred. Please try again.");
    }
  };

  const handleEdit = (id: number) => {
    navigate("/user/edit/" + id);
  };

  return (
    <Container>
      <h1 className="display-4">Search User To Edit</h1>
      <Form onSubmit={handleSubmit} className="position-relative">
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>English Name:</Form.Label>
          <Form.Control
            type="text"
            value={EN_name}
            onChange={handleENNameChange}
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="mt-3 float-end">
          Search
        </Button>
      </Form>

      {data.length > 0 && (
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>English Name</th>
              <th>Thai Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr key={user.id}>
                <td>{user.Eng_name}</td>
                <td>{user.TH_name}</td>
                <td>
                  <Button variant="primary" onClick={() => handleEdit(user.id)}>
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() =>
                      handleDelete(user.id, user.TH_name, user.Eng_name)
                    }
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
