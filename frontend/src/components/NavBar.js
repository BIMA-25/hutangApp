import { Image } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./NavBar.css"; // Mengimpor file CSS khusus untuk navbar

export default function NavBar() {
  return (
    <Navbar expand="lg" className="full-width-navbar">
      <Container>
        <Navbar.Brand href="/">
          <Image
            src={`${process.env.PUBLIC_URL}/logo.png`}
            alt="Logo"
            height={5}
            width={80}
          />{" "}
          {/* Mengatur tinggi logo */}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/" className="custom-nav-link">
              Home
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
