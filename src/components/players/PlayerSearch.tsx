import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const PlayerSearch = () => {
  const sortTypes = [
    {
      id: 1,
      sort: "alph",
      text: "Alphabetical",
    },
    {
      id: 2,
      sort: "wins",
      text: "Most wins",
    },
    {
      id: 3,
      sort: "winrate",
      text: "Win rate",
    },
    {
      id: 4,
      sort: "placing",
      text: "Best placing",
    },
  ];

  return (
    <Form>
      <Form.Group className="searchBar">
        <Form.Label>Search by name</Form.Label>
        <InputGroup>
          <InputGroup.Text>
            <FontAwesomeIcon icon={faSearch} />
          </InputGroup.Text>
          <Form.Control type="text"></Form.Control>
        </InputGroup>
      </Form.Group>
      <Form.Group>
        <Form.Label>Sort by</Form.Label>
        <Form.Select>
          {sortTypes.map((type) => (
            <option key={type["id"]} value={type["sort"]}>
              {type["text"]}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </Form>
  );
};

export default PlayerSearch;
