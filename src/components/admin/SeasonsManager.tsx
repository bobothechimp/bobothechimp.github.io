import React from "react";
import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DataTable from "./DataTable";
import DeleteModal from "./DeleteModal";
import AddDataForm from "./AddDataForm";
import { Input } from "./AddDataForm";
import Alert from "../Alert";

import * as ROUTES from "../../global/routes";
interface Props {
  seasons: object[];
  getData: () => void;
}

const SeasonsManager = ({ seasons, getData }: Props) => {
  const [seasonToDelete, setSeasonToDelete] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    show: false,
    message: "",
  });

  // Create list of years for semester dropdown
  const date = new Date();
  const curYear = date.getFullYear();
  let years: number[] = [];
  for (let y = 2010; y <= curYear + 10; y++) {
    years.push(y);
  }

  const [values, setValues] = useState({
    game: "Ultimate/Brawl",
    fallOrSpring: "Fall",
    year: "" + curYear,
    season_num: "",
    num_weeks: "",
  });

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

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validInputs = () => {
    if (values.season_num === "" || values.num_weeks === "") {
      return false;
    }

    try {
      let snInt = Number(values.season_num);
      if (!(snInt % 1 === 0 && snInt > 0)) {
        return false;
      }
    } catch (error) {
      //Catch an error if sn cannot be parsed to int
      return false;
    }
    try {
      let nwInt = Number(values.num_weeks);
      if (!(nwInt % 1 === 0 && nwInt >= 1 && nwInt <= 15)) {
        return false;
      }
    } catch (error) {
      //Catch an error if nw cannot be parsed to int
      return false;
    }

    //Passed all tests, return true
    return true;
  };

  // Posting entered data for new season to backend
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validInputs()) {
      setErrorMessage({
        show: true,
        message:
          "Season number must be a positive integer. Number of weeks must be an integer between 1 and 15.",
      });
      return;
    }
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
              responsive={false}
              handleDeleteButton={handleDeleteButton}
            />
          </Col>
          <Col lg={{ span: 4 }} xl={{ span: 3 }}>
            {errorMessage.show && (
              <Alert
                onClose={() =>
                  setErrorMessage({ ...errorMessage, show: false })
                }
              >
                {errorMessage.message}
              </Alert>
            )}
            <div className="addDataForm">
              <AddDataForm
                handleSubmit={handleSubmit}
                onChange={onChange}
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
