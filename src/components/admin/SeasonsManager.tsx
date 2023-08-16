import React from "react";
import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DataTable from "./DataTable";
import AddSeason from "./AddSeason";
import DeleteModal from "./DeleteModal";

import * as ROUTES from "../../global/routes";

interface Props {
  seasons: object[];
  getData: () => void;
}

const SeasonsManager = ({ seasons, getData }: Props) => {
  const [seasonToDelete, setSeasonToDelete] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Posting entered data for new season to backend
  const handleSubmit = (e) => {
    e.preventDefault();
    const xhr = new XMLHttpRequest();
    const info = new FormData(e.target);
    xhr.addEventListener("load", (event) => {
      console.log("Successfully added season.");
      getData();
    });
    xhr.open("POST", ROUTES.SERVER_ADD_SEASON);
    xhr.send(info);
  };

  // Making delete modal appear and display the season to delete
  const handleDeleteButton = (season) => {
    setSeasonToDelete(season);
    setShowDeleteModal(true);
  };

  // Posting ID for deleted season to backend
  const handleDelete = (season) => {
    const xhr = new XMLHttpRequest();
    const info = new FormData();
    info.append("season_id", season["id"]);
    xhr.addEventListener("load", (event) => {
      console.log("Successfully deleted season.");
      setShowDeleteModal(false);
      getData();
    });
    xhr.open("POST", ROUTES.SERVER_DELETE_SEASON);
    xhr.send(info);
  };

  return (
    <>
      <Container>
        <Row>
          <Col lg={{ span: 8 }} xl={{ span: 9 }}>
            <DataTable
              rows={seasons}
              titles={[
                "ID",
                "Game",
                "Season",
                "Weeks",
                "First Bimonthly",
                "Second Bimonthly",
                "Semester",
              ]}
              handleDeleteButton={handleDeleteButton}
            />
          </Col>
          <Col lg={{ span: 4 }} xl={{ span: 3 }}>
            <div className="addDataForm">
              <AddSeason handleSubmit={handleSubmit} />
            </div>
          </Col>
        </Row>
      </Container>
      <DeleteModal
        data={seasonToDelete}
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleDelete={() => handleDelete(seasonToDelete)}
      />
    </>
  );
};

export default SeasonsManager;
