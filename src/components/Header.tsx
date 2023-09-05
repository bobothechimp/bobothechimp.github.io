import { useState } from "react";
import { Container, Navbar, Nav, NavDropdown, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import * as ROUTES from "../global/routes";

import logo from "../assets/logos/buss-logo.png";

import "../styles/header.css";

function Header() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      setError("");
      await logout();
      navigate(ROUTES.HOME);
    } catch {
      setError("Failed to log out");
    }
  }

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
            {currentUser && (
              <NavDropdown title="Admin" id="basic-nav-dropdown">
                <NavDropdown.Item href={ROUTES.ADMIN_DASHBOARD}>
                  Dashboard
                </NavDropdown.Item>
                <NavDropdown.Item href={ROUTES.ADMIN_DATA_MANAGER}>
                  Data Manager
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Log Out
                </NavDropdown.Item>
                {error && <Alert variant="danger">{error}</Alert>}
              </NavDropdown>
            )}
            {!currentUser && (
              <Nav.Link href={ROUTES.ADMIN_LOGIN}>Admin Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
