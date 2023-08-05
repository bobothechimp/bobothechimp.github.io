import { Accordion, Container, Row, Col } from "react-bootstrap";

import RulesUltimate from "./RulesUltimate";
import RulesMelee from "./RulesMelee";
import RulesBrawl from "./RulesBrawl";

import "../styles/about.css";

const Rules = () => {
  return (
    <>
      <h1 className="sectionTitle">Rules & Policies</h1>
      <Container>
        <Row>
          <Col lg={{ span: 10, offset: 1 }}>
            <Accordion flush>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Ultimate Ruleset</Accordion.Header>
                <Accordion.Body className="ruleset">
                  <RulesUltimate />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Melee Ruleset</Accordion.Header>
                <Accordion.Body className="ruleset">
                  <RulesMelee />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>Brawl Ruleset</Accordion.Header>
                <Accordion.Body className="ruleset">
                  <RulesBrawl />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Rules;
