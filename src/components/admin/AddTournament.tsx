import React from "react";
import { Form, Row, Button, OverlayTrigger } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { renderAddEventsTooltip } from "../../global/tooltips";

interface Props {
  handleSubmit: (any) => void;
  seasons: object[];
}

const AddTournament = ({ handleSubmit, seasons }: Props) => {
  return (
    <Form onSubmit={handleSubmit} method="POST">
      <Row>
        <Form.Group className="fullSelect" controlId="season">
          <Form.Label>Select a season</Form.Label>
          <Form.Select name="season_id" aria-label="Select season">
            {seasons.map((season) => (
              <option value={season["id"]} key={season["id"]}>
                {season["semester"]} {season["game"]} (ID: {season["id"]})
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group className="shortText" controlId="week">
          <Form.Label>Week number</Form.Label>
          <Form.Control name="week_num" type="text" />
        </Form.Group>
      </Row>
      <Row>
        <Form.Group className="longText" controlId="tournament_url">
          <Form.Label>Tournament URL</Form.Label>
          <Form.Control name="tournament_url" type="text" />
        </Form.Group>
      </Row>
      <Row>
        <Form.Group className="checkBox" controlId="tournament_url">
          <Form.Check
            name="auto_add_events"
            type={"checkbox"}
            id={"default-checkbox"}
            label={
              <>
                Auto add events{" "}
                <OverlayTrigger
                  placement="top"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderAddEventsTooltip}
                >
                  <FontAwesomeIcon icon={faCircleQuestion} />
                </OverlayTrigger>
              </>
            }
          />
        </Form.Group>
      </Row>
      <Row>
        <Button variant="primary" type="submit">
          Add Tournament
        </Button>
      </Row>
    </Form>
  );
};

export default AddTournament;
