import Header from "../components/Header";
import Footer from "../components/Footer";
import { Col, Container, Row } from "react-bootstrap";

import "../styles/notFound.css";

const NotFound = () => {
  return (
    <>
      <Header />
      <Container id="notFound">
        <Row>
          <Col>
            <h1>404 Page Not Found</h1>
            <div id="joke">
              <p>
                What do Ganondorf's out of shield options, Little Mac's good
                aerials, top-level Mii Swordfighter players, and this page have
                in common? They all don't exist!
              </p>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default NotFound;
