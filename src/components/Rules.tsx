import { Accordion, Container, Row, Col } from "react-bootstrap";

import RulesUltimate from "./RulesUltimate";
import RulesMelee from "./RulesMelee";
import RulesBrawl from "./RulesBrawl";

import "../styles/about.css";

const Rules = () => {
  return (
    <>
      <h1 id="rules" className="sectionTitle">
        Rules & Policies
      </h1>
      <Container>
        <Row>
          <Col lg={{ span: 4, offset: 0 }} className="rules">
            <p>
              All tournament brackets are double elimination, meaning you must
              lose two sets to be eliminated. Sets are best-of-3 until the later
              portions of the bracket (usually top 6, but this varies between
              tournaments).
            </p>
            <p>
              We ask that all attendees wear masks in the event rooms. Briefly
              taking them off is allowed, but please go to the hallways outside
              to take them off for extended periods of time like when eating or
              drinking.
            </p>
            <p>
              You are allowed to bring your own setups to events (and we greatly
              appreciate it if you do!), but please disable all modifications
              before the tournament bracket starts.
            </p>
          </Col>
          <Col lg={{ span: 8, offset: 0 }}>
            <Accordion className="rulesets">
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
