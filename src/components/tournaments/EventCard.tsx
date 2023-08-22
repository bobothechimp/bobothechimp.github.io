import React, { ReactNode } from "react";
import { Container, Row, Col } from "react-bootstrap";

import { createOrdinalIndicator as createOI } from "../../global/tools";

import "../../styles/tournaments.css";

interface Props {
  title: string;
  date: string;
  tournamentName: string;
  entrants: number;
  link: string;
  winners: string[];
  upset: any[] | string;
  spr: any[] | string;
}

const EventCard = ({
  title,
  date,
  tournamentName,
  entrants,
  link,
  winners,
  upset,
  spr,
}: Props) => {
  // Create podium block
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
        <Col
          xs={{ span: 1, offset: 4 }}
          md={{ span: 2, offset: 0 }}
          xl={{ span: 2, offset: 0 }}
        >
          {placing}
        </Col>
        <Col
          xs={{ span: 6, offset: 1 }}
          md={{ span: 9, offset: 1 }}
          xl={{ span: 9, offset: 1 }}
          className="winnerName"
        >
          {winners[i]}
        </Col>
      </Row>
    );
  }

  // Create upset block
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

  // Create SPR block
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
      <Container className="eventCard">
        <Row className="eventHeader">
          <Col xs={{ span: 6, offset: 3 }} className="eventTitle">
            <h2>{title}</h2>
            <h5>@ {tournamentName}</h5>
          </Col>
          <Col xs={{ span: 3 }} className="eventBasicInfo">
            <p className="text-muted">
              {date} <br />
              {entrants} Entrants <br />
              <a href={link} target="_blank">
                Start.gg Link
              </a>
            </p>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 4 }} className="eventItem">
            <h4 className="eventItemTitle">Podium</h4>
            <Container>{top3}</Container>
          </Col>
          <Col md={{ span: 4 }} className="eventItem">
            <h4 className="eventItemTitle">Biggest Upset</h4>
            {upsetText}
          </Col>
          <Col md={{ span: 4 }} className="eventItem">
            <h4 className="eventItemTitle">Highest SPR</h4>
            {sprText}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default EventCard;
