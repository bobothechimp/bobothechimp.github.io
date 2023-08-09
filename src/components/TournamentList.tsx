import { useState, useEffect } from "react";
import { ListGroup, Form } from "react-bootstrap";
import axios from "axios";

import getTournamentWinners from "../querying/TournamentQueries";

const TournamentList = () => {
  const [winners, setWinners] = useState([[]]);
  getTournamentWinners(12, 9, setWinners);

  return (
    <>
      <h1>Tournaments</h1>
      <Form.Select size="sm">
        <option value="none">Season</option>
        <option value="9">9</option>
        <option value="10">10</option>
        <option value="11">11</option>
        <option value="12">12</option>
      </Form.Select>
      <Form.Select size="sm">
        <option value="none">Week</option>
        <option value="9">9</option>
        <option value="10">10</option>
        <option value="11">11</option>
        <option value="12">12</option>
      </Form.Select>
      {winners.map((top3) => (
        <ListGroup key={top3.toString()}>
          {top3.map((player) => (
            <ListGroup.Item key={player}>{player}</ListGroup.Item>
          ))}
        </ListGroup>
      ))}
    </>
  );
};

export default TournamentList;
