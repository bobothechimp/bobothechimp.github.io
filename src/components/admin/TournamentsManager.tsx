import React from "react";
import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DataTable from "./DataTable";
import DeleteModal from "./DeleteModal";
import AddDataForm from "./AddDataForm";
import { Input } from "./AddDataForm";

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

  const seasonsOptions = seasons.map((season) => (
    <option value={season["id"]} key={season["id"]}>
      {season["semester"]} {season["game"]} (ID: {season["id"]})
    </option>
  ));

  const inputs: Input[] = [
    {
      id: 1,
      name: "season_id",
      cssClass: "fullSelect",
      type: "select",
      options: [seasonsOptions],
      defaultValues: [seasonsOptions[0]],
      label: "Select a season",
    },
    {
      id: 2,
      name: "week_num",
      cssClass: "shortText",
      type: "text",
      label: "Week number",
    },
    {
      id: 3,
      name: "tournament_url",
      cssClass: "longText",
      type: "text",
      label: "Tournament URL",
    },
    {
      id: 4,
      name: "auto_add_events",
      cssClass: "checkBox",
      type: "eventsCheckbox",
      options: [],
      defaultValues: [],
      label: "",
    },
  ];

  return (
    <>
      <Container>
        <Row>
          <Col md={{ span: 7 }} lg={{ span: 6 }} xl={{ span: 7 }}>
            <DataTable
              rows={tournaments}
              titles={["ID", "Season ID", "Season Name", "Week", "Date"]}
              responsive={false}
              handleDeleteButton={handleDeleteButton}
            />
          </Col>
          <Col md={{ span: 5 }} lg={{ span: 6 }} xl={{ span: 4, offset: 1 }}>
            <div className="addDataForm">
              <AddDataForm
                handleSubmit={handleSubmit}
                inputs={inputs}
                objectName="Tournament"
              />
              {/* <AddTournament seasons={seasons} handleSubmit={handleSubmit} /> */}
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
