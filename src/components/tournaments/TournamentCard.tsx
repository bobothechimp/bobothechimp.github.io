import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import { createOrdinalIndicator as createOI } from "../../global/tools";

interface Props {
  title: string;
  date: string;
  events: object[];
}

const TournamentCard = ({ title, date, events }: Props) => {
  return (
    <Container className="tournamentCard">
      <Row className="tournamentTitle">
        <h5>{title}</h5>
      </Row>
      <Row className="tournamentDate">
        <p className="text-muted">{date}</p>
      </Row>
      {events.map((event) => (
        <Row key={event["id"]} className="tournamentEvent">
          <p className="tournamentEventTitle">{event["title"]}</p>
          <p>
            <span className="first">1{createOI(1)}</span> {event["top3"][0]}
          </p>
        </Row>
      ))}
    </Container>
  );
};

export default TournamentCard;
