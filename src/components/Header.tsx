import React from "react";
import { Link } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

import "../styles/header.css";

import * as ROUTES from "../global/routes";

import logo from "../assets/buss-logo.png";

function Header() {
  return (
    <Navbar expand="sm" className="bg-body-secondary">
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
              <NavDropdown.Item href={ROUTES.WHENWHERE}>
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
