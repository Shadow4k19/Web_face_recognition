import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, Modal } from 'react-bootstrap';

interface ModalSuccessProps {
	show: boolean;
	title: string;
	onClose: () => void;
}

export default function ModalSuccess({ show, title, onClose }: ModalSuccessProps) {
	return (
		<Modal show={show} onHide={onClose} centered>
			<Modal.Body className="text-center">
				<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="green" className="bi bi-check-circle" viewBox="0 0 16 16">
					<path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.97 5.53l-4.54 4.53a.5.5 0 0 1-.7 0L3.02 8.7a.5.5 0 0 1 .7-.7l2.02 2.02 4.04-4.04a.5.5 0 0 1 .7.7z" />
				</svg>
				<h4 className="mt-3">{title}</h4>
				<Button variant="success" onClick={onClose}>Confirm</Button>
			</Modal.Body>
		</Modal>
	);
}
