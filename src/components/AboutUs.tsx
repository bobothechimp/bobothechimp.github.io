import { Container, Row, Col, Card } from "react-bootstrap";

import thinking from "../assets/thinking.png";
import newquake from "../assets/newquake.png";

import "../styles/about.css";

const AboutUs = () => {
  return (
    <Container>
      <h1 className="sectionTitle">About Us</h1>
      <Row>
        <Col md={{ span: 3, offset: 0 }}>
          <Card className="toCard">
            <Card.Body>
              <Card.Img
                src={thinking}
                style={{ width: "30%" }}
                className="toPFP"
              />
              <Card.Title>:thinking:</Card.Title>
              <Card.Subtitle className="mb-3 text-muted">Nick S.</Card.Subtitle>
              <Card.Text>Head TO for Ultimate and Brawl</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={{ span: 3, offset: 0 }}>
          <Card className="toCard">
            <Card.Body>
              <Card.Img
                src={newquake}
                style={{ width: "30%" }}
                className="toPFP"
              />
              <Card.Title>Newquake</Card.Title>
              <Card.Subtitle className="mb-3 text-muted">
                Joshua Emokpae
              </Card.Subtitle>
              <Card.Text>Head TO for Melee</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={{ span: 6, offset: 0 }}>
          <p>
            Boston University Smash Society (BUSS) is a club dedicated to
            hosting <i>Super Smash Bros.</i> gatherings for all to enjoy. No
            matter your skill level, your age, or whether you attend BU,
            everyone can show up for gaming fun.
          </p>
          <p>
            Our events run weekly throughout every school semester, with{" "}
            <i>Melee</i> on Fridays and <i>Ultimate</i> and <i>Brawl</i> on
            Saturdays. Each event will have a free-to-enter bracket, but you're
            more than welcome to come just for casual matches. We also host one
            or two larger scale "BU Bimonthly" events each semester with paid
            entry and cash prizes.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;
