import React from "react";
import { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";

import PlayerCard from "./PlayerCard";
import PlayerSearch from "./PlayerSearch";
import PageSelect from "../PageSelect";

import * as ROUTES from "../../global/routes";

const PlayerList = () => {
  const [players, setPlayers] = useState([]);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const perPageOptions = [5, 10, 15, 20];

  useEffect(() => {
    fetch(ROUTES.SERVER_GET_PLAYERS, {
      method: "POST",
      body: JSON.stringify({
        page: page,
        perPage: perPage,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data["players"]);
        setTotalPlayers(data["total"]);
      });
  }, []);

  const updatePerPage = (selectedPerPage) => {
    setPerPage(selectedPerPage.target.value);
  };

  return (
    <>
      <h1 className="sectionTitle">Players</h1>
      <Container>
        <Row>
          <Col lg={{ span: 4 }}>
            <div className="dataSelectForm">
              <PlayerSearch />
            </div>
            <PageSelect
              current={page}
              perPage={perPage}
              totalPages={Math.ceil((1.0 * totalPlayers) / perPage)}
              totalItems={totalPlayers}
              onChangePage={(newPage) => setPage(newPage)}
              onChangePerPage={(newPerPage) => setPerPage(newPerPage)}
            />
          </Col>
          <Col lg={{ span: 8 }}>
            {players.map((player) => (
              <Row key={player["id"]}>
                <PlayerCard
                  name={player["name"]}
                  team={player["team"]}
                  numWins={player["numWins"]}
                  numLosses={player["numLosses"]}
                  topPlacing={player["topPlacing"]}
                  demon={player["demon"]}
                  blessing={player["blessing"]}
                />
              </Row>
            ))}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PlayerList;
