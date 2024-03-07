import React from 'react'
import { Image, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
	let navigate = useNavigate();
	return (
		<Image fluid
			className="position-fixed start-0 bottom-0 setting m-1"
			src="./images/back.webp"
			onClick={() => navigate("/")}
		/>
	)
}
