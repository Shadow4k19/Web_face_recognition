import { Navbar, Button } from 'react-bootstrap';
import user from "../components/User";

export default function MyNav() {
	const Login = () =>{
		window.location.href = "/login"
	}

	const Logout = () =>{
		user.deleteUser();
		window.location.href = "/login"
	}

    return (
        <Navbar expand="lg" className='px-3 Navbar'>
            <Navbar.Brand href="/" ><u>ระบบทักทาย สวัสดีฮาฟฟุ้ว</u></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            </Navbar.Collapse>
            {user.getStatus() !== "true" ? 
                <Button variant='danger' onClick={Login}>Login</Button> :
                <Button variant='danger' onClick={Logout}>Logout</Button>
            }
        </Navbar>
    );
}
