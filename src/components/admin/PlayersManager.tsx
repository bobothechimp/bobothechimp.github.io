import { useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";

import Alert from "../Alert";
import DataTable from "./DataTable";

import * as ROUTES from "../../global/routes";

interface Props {
  players: object[]; // players to display
  getData: () => void; // how to handle refreshing the data
}

const PlayersManager = ({ players, getData }: Props) => {
  const [statusMessage, setStatusMessage] = useState({
    show: false,
    color: "danger",
    message: "",
  });

  // Recalculating players' stats
  const handleSubmit = (e) => {
    e.preventDefault();
    const xhr = new XMLHttpRequest();
    const info = new FormData();
    xhr.addEventListener("load", (event) => {
      const response = JSON.parse(xhr.response);
      let color;
      switch (response["status_code"]) {
        case 0:
          color = "success";
          break;
        case 1:
          color = "warning";
          break;
        case 2:
          color = "warning";
          break;
        case 3:
          color = "danger";
          break;
      }
      setStatusMessage({
        show: true,
        color: color,
        message: response["message"],
      });
      getData();
    });
    xhr.open("POST", ROUTES.SERVER_RECALCULATE_PLAYERS);
    xhr.send(info);
  };

  return (
    <Container>
      <Row>
        <Col md={{ span: 7 }} lg={{ span: 6 }} xl={{ span: 7 }}>
          <DataTable
            rows={players}
            titles={[
              "ID",
              "Name",
              "Team",
              "Wins",
              "Losses",
              "Highest Placing (event name, tournament name, placing)",
              "Bracket demon (player, wins, losses)",
              "Bracket blessing (player, wins, losses)",
            ]}
            responsive={true}
          />
        </Col>
        <Col md={{ span: 5 }} lg={{ span: 6 }} xl={{ span: 4, offset: 1 }}>
          <div className="recalculatePlayers">
            <Form>
              <Row>
                <Button onClick={handleSubmit}>Recalculate player stats</Button>
                <Form.Text>
                  This will go through all events in the database to recalculate
                  all players' number of wins, number of losses, top placing,
                  bracket demon, and bracket blessing.
                </Form.Text>
                <Form.Text>
                  Due to rate limits of the start.gg API, at most 80 events can
                  be processed per minute. This may take a few minutes to
                  complete.
                </Form.Text>
              </Row>
            </Form>
          </div>
          {statusMessage.show && (
            <Alert
              onClose={() =>
                setStatusMessage({ ...statusMessage, show: false })
              }
              color={statusMessage.color}
            >
              {statusMessage.message}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PlayersManager;
