import React from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import ManagementCard from '../components/ManagementCard'
import MyNav from '../components/MyNav'

export default function Management() {
	return (
		<Container>
			<Row>
				<MyNav></MyNav>
			</Row>
			<Row className='text-center my-1'>
				<u className='display-6'>backyard management</u>
			</Row>
			<Row>
				<ManagementCard href="/user" title='User management' cardImageSrc='./images/setting.png'></ManagementCard>
				<ManagementCard href="/setting" title='Message Setting' cardImageSrc='./images/setting.png'></ManagementCard>
				<ManagementCard href="/admin" title='Admin management' cardImageSrc='./images/setting.png'></ManagementCard>
			</Row>
		</Container>
	)
}
