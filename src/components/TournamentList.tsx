import { useState } from "react";
import { ListGroup } from "react-bootstrap";

import getTournamentWinners from "../querying/TournamentQueries";

const TournamentList = () => {
  const [winners, setWinners] = useState([[]]);
  getTournamentWinners(12, 9, setWinners);

  return (
    <>
      <h1>Tournaments</h1>
      {winners.map((top3) => (
        <ListGroup>
          {top3.map((player) => (
            <ListGroup.Item>{player}</ListGroup.Item>
          ))}
        </ListGroup>
      ))}
    </>
  );
};

export default TournamentList;
