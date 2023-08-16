import React from "react";
import { Form, Row, Button } from "react-bootstrap";

interface Props {
  handleSubmit: (any) => void;
}

const AddSeason = ({ handleSubmit }: Props) => {
  // Create list of years for semester dropdown
  const date = new Date();
  const curYear = date.getFullYear();
  let years: number[] = [];
  for (let y = 2010; y <= curYear + 10; y++) {
    years.push(y);
  }

  return (
    <Form onSubmit={handleSubmit} method="POST">
      <Row>
        <Form.Group className="game" controlId="game">
          <Form.Label>Select a game</Form.Label>
          <Form.Select name="game" aria-label="Select game">
            <option value="Ultimate/Brawl">Ultimate/Brawl</option>
            <option value="Melee">Melee</option>
          </Form.Select>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group className="semester" controlId="semester">
          <Form.Label>Semester</Form.Label>
          <Form.Select name="fallOrSpring" aria-label="Fall or spring">
            <option value="Fall">Fall</option>
            <option value="Spring">Spring</option>
          </Form.Select>
          <Form.Select name="year" defaultValue={curYear}>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group className="seasonNumber" controlId="season">
          <Form.Label>Season number</Form.Label>
          <Form.Control name="season_num" type="text" />
        </Form.Group>
      </Row>
      <Row>
        <Form.Group className="numWeeks" controlId="num_weeks">
          <Form.Label>Number of Weeks</Form.Label>
          <Form.Control name="num_weeks" type="text" />
        </Form.Group>
      </Row>
      <Row>
        <Button variant="primary" type="submit">
          Add Season
        </Button>
      </Row>
    </Form>
  );
};

export default AddSeason;
