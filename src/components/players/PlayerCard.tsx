import { Col, Container, Row } from "react-bootstrap";

import { createOrdinalIndicator as createOI } from "../../global/tools";

interface Props {
  name: string; // name of player
  team: string; // player's team
  numWins: number; // number of wins
  numLosses: number; // number of losses
  topPlacing: any[]; // [name of event of their highest placing, name of that event's tournament, number of entrants at event, player's placing]
  demon: any[]; // [name of bracket demon, number of wins this player has against them, number of losses this player has against them]
  blessing: any[]; // [name of bracket blessing, number of wins this player has against them, number of losses this player has against them]
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
