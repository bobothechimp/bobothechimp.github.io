import React from "react";
import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DataTable from "./DataTable";
import AddTournament from "./AddTournament";
import DeleteModal from "./DeleteModal";

import * as ROUTES from "../../global/routes";

interface Props {
  tournaments: object[];
  seasons: object[];
  getData: () => void;
}

const TournamentsManager = ({ tournaments, seasons, getData }: Props) => {
  const [tournamentToDelete, setTournamentToDelete] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Posting entered data for new tournament to backend
  const handleSubmit = (e) => {
    e.preventDefault();
    const xhr = new XMLHttpRequest();
    const info = new FormData(e.target);
    xhr.addEventListener("load", (event) => {
      console.log("Successfully added tournament.");
      getData();
    });
    xhr.open("POST", ROUTES.SERVER_ADD_TOURNAMENT);
    xhr.send(info);
  };

  // Making delete modal appear and display the tournament to delete
  const handleDeleteButton = (tournament) => {
    setTournamentToDelete(tournament);
    setShowDeleteModal(true);
  };

  // Posting ID for deleted tournament to backend
  const handleDelete = (tournament) => {
    const xhr = new XMLHttpRequest();
    const info = new FormData();
    info.append("tournament_id", tournament["id"]);
    xhr.addEventListener("load", (event) => {
      console.log("Successfully deleted tournament.");
      setShowDeleteModal(false);
      getData();
    });
    xhr.open("POST", ROUTES.SERVER_DELETE_TOURNAMENT);
    xhr.send(info);
  };

  return (
    <>
      <Container>
        <Row>
          <Col lg={{ span: 6 }} xl={{ span: 7 }}>
            <DataTable
              rows={tournaments}
              titles={["ID", "Season ID", "Week", "Date"]}
              handleDeleteButton={handleDeleteButton}
            />
          </Col>
          <Col lg={{ span: 6 }} xl={{ span: 5 }}>
            <div className="addDataForm">
              <AddTournament seasons={seasons} handleSubmit={handleSubmit} />
            </div>
          </Col>
        </Row>
      </Container>
      <DeleteModal
        data={tournamentToDelete}
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleDelete={() => handleDelete(tournamentToDelete)}
      />
    </>
  );
};

export default TournamentsManager;
