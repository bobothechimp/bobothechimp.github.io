import React from "react";
import { Form, Row, Button } from "react-bootstrap";

interface Props {
  handleSubmit: (any) => void;
  seasons: object[];
}

const AddTournament = ({ handleSubmit, seasons }: Props) => {
  return (
    <Form onSubmit={handleSubmit} method="POST">
      <Row>
        <Form.Group className="season" controlId="season">
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
        <Form.Group className="tournamentURL" controlId="tournament_url">
          <Form.Label>Tournament URL</Form.Label>
          <Form.Control name="tournament_url" type="text" />
        </Form.Group>
      </Row>
      <Row>
        <Form.Group className="weekNumber" controlId="week">
          <Form.Label>Week number</Form.Label>
          <Form.Control name="week_num" type="text" />
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
