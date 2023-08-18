import React from "react";
import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DataTable from "./DataTable";
import DeleteModal from "./DeleteModal";
import AddDataForm from "./AddDataForm";
import { Input } from "./AddDataForm";

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

  // Create list of years for semester dropdown
  const date = new Date();
  const curYear = date.getFullYear();
  let years: number[] = [];
  for (let y = 2010; y <= curYear + 10; y++) {
    years.push(y);
  }

  const inputs: Input[] = [
    {
      id: 1,
      name: "game",
      cssClass: "fullSelect",
      type: "select",
      options: [["Ultimate/Brawl", "Melee"]],
      defaultValues: [["Ultimate/Brawl"]],
      label: "Select a game",
    },
    {
      id: 2,
      name: "fallOrSpring,year",
      cssClass: "halfSelect",
      type: "doubleSelect",
      options: [["Fall", "Spring"], years],
      defaultValues: ["Fall", curYear],
      label: "Semester",
    },
    {
      id: 3,
      name: "season_num",
      cssClass: "shortText",
      type: "text",
      label: "Season Number",
    },
    {
      id: 4,
      name: "num_weeks",
      cssClass: "shortText",
      type: "text",
      label: "Number of weeks",
    },
  ];

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
              responsive={false}
              handleDeleteButton={handleDeleteButton}
            />
          </Col>
          <Col lg={{ span: 4 }} xl={{ span: 3 }}>
            <div className="addDataForm">
              <AddDataForm
                handleSubmit={handleSubmit}
                inputs={inputs}
                objectName="Season"
              />
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
