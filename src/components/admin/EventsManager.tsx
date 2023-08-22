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
  events: object[];
  tournaments: object[];
  getData: () => void;
}

const EventsManager = ({ events, tournaments, getData }: Props) => {
  const [eventToDelete, setEventToDelete] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState({
    show: false,
    color: "danger",
    message: "",
  });

  const [values, setValues] = useState({
    event_url_id: "",
  });

  let inputs: Input[] = [
    {
      id: 1,
      name: "event_url_id",
      cssClass: "longText",
      type: "text",
      label: "Event ID/URL",
      note: "Event will be attached to its tournament automatically.",
    },
  ];

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  // Posting entered data for new tournament to backend
  const handleSubmit = (e) => {
    e.preventDefault();
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
    xhr.open("POST", ROUTES.SERVER_ADD_EVENT);
    xhr.send(info);
  };

  // Making delete modal appear and display the tournament to delete
  const handleDeleteButton = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  // Posting ID for deleted tournament to backend
  const handleDelete = (event) => {
    const xhr = new XMLHttpRequest();
    const info = new FormData();
    info.append("event_id", event["id"]);
    xhr.addEventListener("load", (event) => {
      console.log("Successfully deleted event.");
      setShowDeleteModal(false);
      getData();
    });
    xhr.open("POST", ROUTES.SERVER_DELETE_EVENT);
    xhr.send(info);
  };

  return (
    <>
      <Container>
        <Row>
          <Col md={{ span: 7 }} lg={{ span: 6 }} xl={{ span: 8 }}>
            <DataTable
              rows={events}
              titles={[
                "ID",
                "Tournament ID",
                "Tournament Name",
                "Title",
                "Date",
                "Entrants",
                "Top 3 (1st, 2nd, 3rd)",
                "Biggest Upset (set, upsetter seed, upsettee seed, UF)",
                "Highest SPR (player, seed, placing, SPR)",
                "Start.gg Link",
              ]}
              responsive={true}
              handleDeleteButton={handleDeleteButton}
            />
          </Col>
          <Col md={{ span: 5 }} lg={{ span: 6 }} xl={{ span: 4 }}>
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
            <div className="addDataForm">
              <AddDataForm
                handleSubmit={handleSubmit}
                onChange={onChange}
                inputs={inputs}
                objectName="Event"
              />
            </div>
          </Col>
        </Row>
      </Container>
      <DeleteModal
        data={eventToDelete}
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleDelete={() => handleDelete(eventToDelete)}
      />
    </>
  );
};

export default EventsManager;
