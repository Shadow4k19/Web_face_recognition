import React from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap';
import { PersonGreet } from '../types/PersonGreet';
import { Image } from "react-bootstrap";

export default function GreetCard({ person }: { person: PersonGreet }) {
	return (
		<Card className="m-3">
			<Row>
				<Col xs={"auto"}>
					<Card.Img
						src={person.avatarImage}
						className="avatar rounded"
					/>
				</Col>
				<Col >
					<Card.Body>
						<Card.Text>
							{person.speech}
						</Card.Text>
						<Image src={person.moodImage} className="mood position-absolute bottom-0 end-0 m-2" />
					</Card.Body>
				</Col>
			</Row>
		</Card>
	)
}
