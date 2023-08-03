import { Container, Row, Col, Card } from "react-bootstrap";

import { MAPS_KEY } from "../global/apikeys";

const WhereWhen = () => {
  return (
    <Container>
      <h1 className="sectionTitle">Where & When</h1>
      <Row className="wwDesc">
        <Col sm={{ span: 6, offset: 0 }}>
          <p>
            All main events are held in BU's College of Arts and Sciences (CAS)
            at 725 Commonwealth Ave. Ultimate and Brawl events happen every
            Saturday in CAS room 426, and Melee events happen every Friday in
            CAS room 227. All events are open until their bracket has been
            completed.
          </p>
          <p>
            BU Bimonthly events are held on one or two Saturdays each semester
            in BU's Photonics Center (PHO) at 8 St. Mary's Street. They're
            located on the 9th floor colloquium room. Their exact date varies
            each semester.
          </p>
        </Col>
        <Col>
          <iframe
            className="mapsEmbed"
            loading="lazy"
            src={
              "https://www.google.com/maps/embed/v1/place?q=place_id:ChIJ0YVyj_B544kR3tGFwmE0yz4&key=" +
              MAPS_KEY
            }
          ></iframe>
        </Col>
      </Row>
      <Row>
        <Col sm={{ span: 4, offset: 0 }}>
          <h3>Melee</h3>
          <p>Fridays, CAS Room 227</p>
          <p>5:15 p.m. - Doors open</p>
          <p>6:00 p.m. - Bracket starts</p>
        </Col>
        <Col sm={{ span: 4, offset: 0 }}>
          <h3>Ultimate & Brawl</h3>
          <p>Saturdays, CAS Room 426</p>
          <p>2:00 p.m. - Doors open</p>
          <p>3:00 p.m. - Brawl bracket starts</p>
          <p>4:30 p.m. - Ultimate bracket starts</p>
        </Col>
        <Col sm={{ span: 4, offset: 0 }}>
          <h3>Bimonthly</h3>
          <p>Date varies, PHO 9th Floor Colloquium Room</p>
          <p>12:00 p.m. - Doors open</p>
          <p>Varies - Brawl bracket starts</p>
          <p>Varies - Side bracket starts</p>
          <p>4:00 p.m. - Ultimate bracket starts</p>
        </Col>
      </Row>
    </Container>
  );
};

export default WhereWhen;
