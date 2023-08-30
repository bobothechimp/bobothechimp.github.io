import React from "react";
import { Col, Container, Row } from "react-bootstrap";

import { createOrdinalIndicator as createOI } from "../../global/tools";

interface Props {
  name: string;
  team: string;
  numWins: number;
  numLosses: number;
  topPlacing: any[];
  demon: any[];
  blessing: any[];
}

const PlayerCard = ({
  name,
  team,
  numWins,
  numLosses,
  topPlacing,
  demon,
  blessing,
}: Props) => {
  return (
    <Container className="playerCard">
      <Row className="playerHeader">
        <Col className="playerTitle">
          <h2 className="text-muted">
            {team != "" && team != null && team + " "}
          </h2>
          <h2>{name}</h2>
        </Col>
      </Row>
      <Row>
        <Col xs={{ span: 3 }}>
          <Row className="playerItemTitle">
            <h4>Record</h4>
          </Row>
          <Row>
            <p>
              {numWins} - {numLosses} (
              {Math.round((100 * numWins) / (numWins + numLosses))}%)
            </p>
          </Row>
        </Col>
        <Col xs={{ span: 5 }}>
          <Row className="playerItemTitle">
            <h4>Best Placing</h4>
          </Row>
          <Row>
            <p>
              {topPlacing[3]}
              {createOI(topPlacing[3])} out of {topPlacing[2]} @ {topPlacing[0]}
            </p>
            <p>({topPlacing[1]})</p>
          </Row>
        </Col>
        <Col xs={{ span: 4 }}>
          <Row className="playerItemTitle">
            <h4>Bracket Demon</h4>
          </Row>
          <Row>
            <p>
              {demon[0]} ({demon[1]} - {demon[2]})
            </p>
          </Row>
          <Row className="playerItemTitle">
            <h4>Bracket Blessing</h4>
          </Row>
          <Row>
            <p>
              {blessing[0]} ({blessing[1]} - {blessing[2]})
            </p>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default PlayerCard;
