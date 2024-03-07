import React from 'react'
import { Card, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

interface ManagementCardProps {
	href: string;
	title: string;
	cardImageSrc: string;
}

export default function ManagementCard({ href, title, cardImageSrc }: ManagementCardProps) {
	let navigate = useNavigate();
	return (
		<Col xs={12} md={true} className="text-center my-2">
			<Card className='bg-light' onClick={() => navigate(href)}>
				<Card.Header className='p-2'>
					<Card.Img
						src={cardImageSrc}
						variant='top'
						className='management-icon'
					/>
					<Card.Title>
						{title}
					</Card.Title>
				</Card.Header>
			</Card>
		</Col>
	)
}
