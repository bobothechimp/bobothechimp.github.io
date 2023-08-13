import React, { ReactNode } from "react";
import { Container, Row, Col } from "react-bootstrap";

import "../styles/tournaments.css";

interface Props {
  children: ReactNode;
  winners: string[];
}

const EventCard = ({ children, winners }: Props) => {
  let top3: JSX.Element[] = [];
  for (let i = 0; i < winners.length; i++) {
    let placing;
    switch (i) {
      case 0:
        placing = <p className="first">1st</p>;
        break;
      case 1:
        placing = <p className="second">2nd</p>;
        break;
      case 2:
        placing = <p className="third">3rd</p>;
        break;
    }

    top3.push(
      <Row>
        <Col sm={{ span: 2 }}>{placing}</Col>
        <Col sm={{ span: 10 }}>{winners[i]}</Col>
      </Row>
    );
  }
  return (
    <>
      <h3>{children}</h3>
      <Container>
        <Row>
          <Col lg={{ span: 3 }}>
            <h4>Podium</h4>
            <Container>{top3}</Container>
          </Col>
          <Col lg={{ span: 2 }}>
            <h4>Biggest Upset</h4>
            BIGDUCKHUNTFAN 3-1 Tweek (UF 13)
          </Col>
          <Col lg={{ span: 2 }}>
            <h4>Highest SPR</h4>
            DDee seeded 61, placed 5th (SPR 7)
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default EventCard;
