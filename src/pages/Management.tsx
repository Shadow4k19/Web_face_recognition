import React from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import ManagementCard from '../components/ManagementCard'
import MyNav from '../components/MyNav'

export default function Management() {
	return (
		<Container className='contrainer-all back-yard'>
			<Row className='text-center my-1'>
				<u className='display-6'>ระบบจัดการหลังบ้าน</u>
			</Row>
			<Row className='back-yard'>
				<ManagementCard href="/user" title='User management' cardImageSrc='./images/people.png'></ManagementCard>
				<ManagementCard href="/setting" title='Message Setting' cardImageSrc='./images/setting.png'></ManagementCard>
				<ManagementCard href="/admin" title='Admin management' cardImageSrc='./images/user.png'></ManagementCard>
			</Row>
		</Container>
	)
}
