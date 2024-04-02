import { Navbar, Button } from 'react-bootstrap'

export default function MyNav() {
	return (
		<Navbar expand="lg" className='px-3 Navbar'>
			<Navbar.Brand href="/" ><u>ระบบทักทาย สวัสดีฮาฟฟุ้ว</u></Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
			</Navbar.Collapse>
			<Button variant='danger'>Login</Button>
		</Navbar>
	)
}
