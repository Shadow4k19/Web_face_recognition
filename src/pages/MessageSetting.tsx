import React, { useState } from 'react';
import { Container, Form, Button, Modal, Row, Col } from 'react-bootstrap';

export default function MessageSetting() {
	const [msg, setMsg] = useState('');
	const [type, setType] = useState('All');

	const handleSave = () => {
		console.log(msg, type);
	}
	const handleDelete = () => {
		console.log("WILL DELETE")
		setMsg('');
		setType('All');
	}

	const handleMsgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setMsg(event.target.value);
	};

	const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setType(event.target.value);
	};
	return (
		<Container>
			<Row>
				<h1 className='display-4'>Message Setting</h1>
			</Row>
			<Row>
				<Form.Group className="mb-3" controlId="name">
					<Form.Label>Message</Form.Label>
					<Form.Control type="text" value={msg} onChange={handleMsgChange} />
				</Form.Group>
				<Form.Group className="mb-3" controlId="surname">
					<Form.Label>Types</Form.Label>
					<Form.Select value={type} onChange={handleTypeChange}>
						<option value="Happy">Happy</option>
						<option value="Angry">Angry</option>
						<option value="Sad">Sad</option>
						<option value="All">All</option>
					</Form.Select>
				</Form.Group>
			</Row>
			<Row>
				<p>show message</p>
				<p className='ms-3'>{msg}</p>
				<p>show message type</p>
				<p className='ms-3'>{type}</p>
			</Row>
			<Row>
				<Col>
					<Button variant="info" className='mt-3 float-end'>
						Search
					</Button>
				</Col>
			</Row>
			<Row>
				<Col>
					<Button variant="primary" className='mt-3' onClick={handleSave}>
						Save
					</Button>
					<Button variant="danger" className='mt-3 float-end' onClick={handleDelete}>
						Delete
					</Button>
				</Col>
			</Row>
		</Container>
	)
}
