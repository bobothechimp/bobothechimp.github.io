import React from "react";
import { Form, Row, Button, OverlayTrigger } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { renderAddEventsTooltip } from "../../global/tooltips";

interface Props {
  handleSubmit: (any) => void;
  tournaments: object[];
}

const AddEvent = ({ handleSubmit, tournaments }: Props) => {
  return (
    <Form onSubmit={handleSubmit} method="POST">
      <Row>
        <Form.Group className="longText" controlId="event_url_id">
          <Form.Label>Event ID/URL</Form.Label>
          <Form.Control name="event_url_id" type="text" />
          <Form.Text className="text-muted">
            Event will be attached to its tournament automatically.
          </Form.Text>
        </Form.Group>
      </Row>
      <Row>
        <Button variant="primary" type="submit">
          Add Event
        </Button>
      </Row>
    </Form>
  );
};

export default AddEvent;
