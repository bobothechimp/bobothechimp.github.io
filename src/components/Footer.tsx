import React from "react";
import { Link } from "react-router-dom";

import { Container, Row, Col } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faDiscord,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

import "../styles/footer.css";

import * as ROUTES from "../global/routes";

import logo from "../assets/buss-logo.png";

function Footer() {
  return (
    <div className="footer">
      <Container>
        <Row className="footer">
          <Col sm={{ span: 6, offset: 0 }} className="footerLinks">
            <a target="_blank" href="https://twitter.com/Smash_BU">
              <FontAwesomeIcon icon={faTwitter} className="footerIcon" />
            </a>
            <a target="_blank" href="https://discord.gg/VNUuZNRR">
              <FontAwesomeIcon icon={faDiscord} className="footerIcon" />
            </a>
            <a
              target="_blank"
              href="https://github.com/bobothechimp/buss_website"
            >
              <FontAwesomeIcon icon={faGithub} className="footerIcon" />
            </a>
          </Col>
          <Col sm={{ span: 6, offset: 0 }} className="footerText">
            <small>
              Room 426 & 227<br></br>College of Arts and Sciences<br></br>725
              Commonwealth Ave Boston, MA
            </small>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col sm={{ span: 12, offset: 0 }} className="footerCopyright">
            <small>Copyright &copy; Noah Barnes</small>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Footer;
