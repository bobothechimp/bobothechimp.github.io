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
    <Container>
      <Row>
        <Col>
          <h2>
            {team != "" && team != null && team + " | "}
            {name}
          </h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <h4>Record</h4>
        </Col>
        <Col>
          <h4>Best Placing</h4>
        </Col>
        <Col>
          <h4>Bracket Demon</h4>
        </Col>
        <Col>
          <h4>Bracket Blessing</h4>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>
            {numWins} - {numLosses} (
            {Math.round((100 * numWins) / (numWins + numLosses))}%)
          </p>
        </Col>
        <Col>
          <p>
            {topPlacing[2]}
            {createOI(topPlacing[2])} @ {topPlacing[0]}
          </p>
          <p>({topPlacing[1]})</p>
        </Col>
        <Col>
          <p>
            {demon[0]} ({demon[1]} - {demon[2]})
          </p>
        </Col>
        <Col>
          <p>
            {blessing[0]} ({blessing[1]} - {blessing[2]})
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default PlayerCard;
