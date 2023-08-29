import React from "react";
import { useState, useEffect } from "react";
import { Tab, Table } from "react-bootstrap";

import PlayerCard from "./PlayerCard";

import * as ROUTES from "../../global/routes";

const PlayerList = () => {
  const [players, setPlayers] = useState([]);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  useEffect(() => {
    fetch(ROUTES.SERVER_GET_PLAYERS)
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data["players"]);
        setTotalPlayers(data["total"]);
      });
  }, []);
  return (
    <Table>
      <tbody>
        {players.map((player) => (
          <tr key={player["id"]}>
            {Object.keys(player).map((key) => (
              <td key={key}>{player[key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default PlayerList;
