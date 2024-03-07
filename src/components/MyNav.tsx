import React from 'react'
import { Navbar, Nav, Form, Button, Col } from 'react-bootstrap'

export default function MyNav() {
	return (
		<Navbar bg="light" expand="lg" className='px-3'>
			<Navbar.Brand href="/" >Hello World!</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
			</Navbar.Collapse>
		</Navbar>
	)
}
