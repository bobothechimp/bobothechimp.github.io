import { useState, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DataTable from "./DataTable";
import DeleteModal from "./DeleteModal";
import AddDataForm from "./AddDataForm";
import { Input } from "./AddDataForm";
import Alert from "../Alert";

import * as ROUTES from "../../global/routes";

interface Props {
  tournaments: object[]; // tournaments to display
  seasons: object[]; // seasons from which to choose in the add tournament form
  getData: () => void; // how to handle refreshing the data
}

const TournamentsManager = ({ tournaments, seasons, getData }: Props) => {
  // Keep track of which tournament is selected for deleting
  const [tournamentToDelete, setTournamentToDelete] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState({
    show: false,
    color: "danger",
    message: "",
  });
  const deleteEvents = useRef(false);

  // List of options for seasons selector in add tournament form
  const seasonsOptions = seasons.map((season) => (
    <option value={season["id"]} key={season["id"]}>
      {season["semester"]} {season["game"]} (ID: {season["id"]})
    </option>
  ));

  // Initial values for the add tournament form
  const [values, setValues] = useState({
    season_id: seasons[0]["id"],
    week_num: "",
    tournament_url_id: "",
    auto_add_events: "off",
  });

  // List of fields for the add tournament form
  const inputs: Input[] = [
    {
      id: 1,
      name: "season_id",
      cssClass: "fullSelect",
      type: "select",
      options: [seasonsOptions],
      defaultValues: [seasonsOptions[0]],
      preBuiltOptions: [true],
      label: "Select a season",
    },
    {
      id: 2,
      name: "week_num",
      cssClass: "shortText",
      type: "text",
      label: "Week number",
      note: 'Add "BM" for bimonthly (e.g. "BM10")',
    },
    {
      id: 3,
      name: "tournament_url_id",
      cssClass: "longText",
      type: "text",
      label: "Tournament ID/URL",
    },
    {
      id: 4,
      name: "auto_add_events",
      cssClass: "checkBox",
      type: "eventsCheckbox",
      label: "",
    },
  ];

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  // Check if inputs are valid on client side before requesting from server
  const validInputs = () => {
    if (values.week_num === "" || values.tournament_url_id === "") {
      return false;
    }

    try {
      let wnInt;
      if (values.week_num.substring(0, 2).toLowerCase() === "bm") {
        wnInt = Number(values.week_num.substring(2));
      } else {
        wnInt = Number(values.week_num);
      }
      if (!(wnInt % 1 === 0 && wnInt > 0)) {
        return false;
      }
    } catch (error) {
      //Catch an error if wn cannot be parsed to int
      return false;
    }

    //Passed all tests, return true
    return true;
  };

  // Posting entered data for new tournament to backend
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validInputs()) {
      setStatusMessage({
        show: true,
        color: "danger",
        message: "Week number must be a positive integer.",
      });
      return;
    }
    const xhr = new XMLHttpRequest();
    const info = new FormData(e.target);
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
    info.append("delete_all_events", "" + deleteEvents.current);
    xhr.addEventListener("load", (event) => {
      console.log("Successfully deleted tournament.");
      setShowDeleteModal(false);
      getData();
    });
    xhr.open("POST", ROUTES.SERVER_DELETE_TOURNAMENT);
    xhr.send(info);
    deleteEvents.current = false;
  };

  const handleDeleteEvents = () => {
    deleteEvents.current = !deleteEvents.current;
  };

  return (
    <>
      <Container>
        <Row>
          <Col md={{ span: 7 }} lg={{ span: 6 }} xl={{ span: 7 }}>
            <DataTable
              rows={tournaments}
              titles={[
                "ID",
                "Season ID",
                "Season Name",
                "Week",
                "Date",
                "Start.gg Link",
              ]}
              responsive={false}
              handleDeleteButton={handleDeleteButton}
            />
          </Col>
          <Col md={{ span: 5 }} lg={{ span: 6 }} xl={{ span: 4, offset: 1 }}>
            <div className="addDataForm">
              <AddDataForm
                handleSubmit={handleSubmit}
                onChange={onChange}
                inputs={inputs}
                objectName="Tournament"
              />
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
            </div>
          </Col>
        </Row>
      </Container>
      <DeleteModal
        data={tournamentToDelete}
        show={showDeleteModal}
        handleClose={() => {
          setShowDeleteModal(false);
          deleteEvents.current = false;
        }}
        handleDelete={() => handleDelete(tournamentToDelete)}
        deleteEventsPrompt={true}
        handleCheckboxChange={handleDeleteEvents}
      />
    </>
  );
};

export default TournamentsManager;
