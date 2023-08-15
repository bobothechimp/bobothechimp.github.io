import React from "react";
import { useState, useEffect } from "react";
import { Form, Button, Table, Container, Row, Col } from "react-bootstrap";

import * as ROUTES from "../global/routes";

const AddSeason = () => {
  // Create list of years for semester dropdown
  const date = new Date();
  const curYear = date.getFullYear();
  let years: number[] = [];
  for (let y = 2010; y <= curYear + 10; y++) {
    years.push(y);
  }

  const [seasons, setSeasons] = useState([]);

  const getSeasons = () => {
    fetch("http://localhost:5000/seasons")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setSeasons(data);
      });
  };

  useEffect(() => {
    getSeasons();
  }, []);

  // Posting entered data to backend
  const handleSubmit = (e) => {
    e.preventDefault();
    const XHR = new XMLHttpRequest();
    const info = new FormData(e.target);
    XHR.addEventListener("load", (event) => {
      console.log("Successfully added season.");
    });
    XHR.open("POST", ROUTES.SERVERADDSEASON);
    XHR.send(info);

    setTimeout(getSeasons, 2000);
  };

  return (
    <Container>
      <Row>
        <Col md={{ span: 7 }} lg={{ span: 8 }} xl={{ span: 9 }}>
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Game</th>
                <th>Semester</th>
                <th>Season</th>
                <th>Weeks</th>
                <th>First Bimonthly</th>
                <th>Second Bimonthly</th>
              </tr>
            </thead>
            <tbody>
              {seasons.map((season) => (
                <tr>
                  <td>{season["id"]}</td>
                  <td>{season["game"]}</td>
                  <td>{season["semester"]}</td>
                  <td>{season["season"]}</td>
                  <td>{season["num_weeks"]}</td>
                  <td>{season["bimonthly1"]}</td>
                  <td>{season["bimonthly2"]}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        <Col
          md={{ span: 4, offset: 1 }}
          lg={{ span: 3, offset: 1 }}
          xl={{ span: 2, offset: 1 }}
        >
          <Form onSubmit={handleSubmit} method="POST">
            <Row>
              <Form.Group className="game" controlId="game">
                <Form.Label>Select a game</Form.Label>
                <Form.Select name="game" aria-label="Default select example">
                  <option value="Ultimate/Brawl">Ultimate/Brawl</option>
                  <option value="Melee">Melee</option>
                </Form.Select>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group className="semester" controlId="semester">
                <Form.Label>Semester</Form.Label>
                <Form.Select name="fallOrSpring">
                  <option value="Fall">Fall</option>
                  <option value="Spring">Spring</option>
                </Form.Select>
                <Form.Select name="year" defaultValue={curYear}>
                  {years.map((year) => (
                    <option value={year}>{year}</option>
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
        </Col>
      </Row>
    </Container>
  );
};

export default AddSeason;
