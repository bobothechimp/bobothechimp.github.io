import React, { ReactNode } from "react";
import { Container, Row, Col } from "react-bootstrap";

import { createOrdinalIndicator as createOI } from "../../global/tools";

import "../../styles/tournaments.css";

interface Props {
  children: ReactNode;
  winners: string[];
  upset: any[] | string;
  spr: any[] | string;
}

const EventCard = ({ children, winners, upset, spr }: Props) => {
  let top3: JSX.Element[] = [];
  for (let i = 0; i < winners.length; i++) {
    let placing;
    switch (i) {
      case 0:
        placing = (
          <p key={1} className="first">
            1{createOI(1)}
          </p>
        );
        break;
      case 1:
        placing = (
          <p key={2} className="second">
            2{createOI(2)}
          </p>
        );
        break;
      case 2:
        placing = (
          <p key={3} className="third">
            3{createOI(3)}
          </p>
        );
        break;
    }

    top3.push(
      <Row key={i}>
        <Col sm={{ span: 2 }}>{placing}</Col>
        <Col sm={{ span: 10 }}>{winners[i]}</Col>
      </Row>
    );
  }

  let upsetText: JSX.Element[] = [];
  if (typeof upset === "string") {
    upsetText = [<p key={"headline"}>{upset}</p>];
  } else {
    upsetText = [
      <p key={"headline"}>{upset[0]}</p>,
      <p key={"details"}>
        ({upset[1]}
        {createOI(upset[1])} seed over {upset[2]}
        {createOI(upset[2])} seed, UF {upset[3]})
      </p>,
    ];
  }

  let sprText: JSX.Element[] = [];
  if (typeof spr === "string") {
    sprText = [<p key={"headline"}>{spr}</p>];
  } else {
    sprText = [
      <p key={"headline"}>{spr[0]}</p>,
      <p key={"details"}>
        (seeded {spr[1]}
        {createOI(spr[1])}, placed {spr[2]}
        {createOI(spr[2])}, SPR {spr[3]})
      </p>,
    ];
  }

  return (
    <>
      <h2 className="eventTitle">{children}</h2>
      <Container className="eventCard">
        <Row>
          <Col lg={{ span: 3 }}>
            <h4>Podium</h4>
            <Container>{top3}</Container>
          </Col>
          <Col lg={{ span: 3 }}>
            <h4>Biggest Upset</h4>
            {upsetText}
          </Col>
          <Col lg={{ span: 3 }}>
            <h4>Highest SPR</h4>
            {sprText}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default EventCard;
