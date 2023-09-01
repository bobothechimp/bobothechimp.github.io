import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";

import * as ROUTES from "../global/routes";

import logo from "../assets/logos/buss-logo.png";

import "../styles/header.css";

function Header() {
  return (
    <Navbar expand="sm" className="header">
      <Container>
        <Navbar.Brand href={ROUTES.HOME}>
          <img src={logo} className="logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
          <Nav>
            <Nav.Link href={ROUTES.HOME}>Home</Nav.Link>
            <NavDropdown title="About" id="basic-nav-dropdown">
              <NavDropdown.Item href={ROUTES.ABOUT}>About Us</NavDropdown.Item>
              <NavDropdown.Item href={ROUTES.WHERE_WHEN}>
                Where & When
              </NavDropdown.Item>
              <NavDropdown.Item href={ROUTES.RULES}>
                Rules & Policies
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href={ROUTES.TOURNAMENTS}>Tournaments</Nav.Link>
            <Nav.Link href={ROUTES.PLAYERS}>Players</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
