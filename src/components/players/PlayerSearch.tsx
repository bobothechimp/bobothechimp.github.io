import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface Props {
  sortTypes: any[];
  onChangeSearch: (e) => void;
  onChangeSort: (e) => void;
}

const PlayerSearch = ({ sortTypes, onChangeSearch, onChangeSort }: Props) => {
  return (
    <Form>
      <Form.Group className="searchBar">
        <Form.Label>Search by name</Form.Label>
        <InputGroup>
          <InputGroup.Text>
            <FontAwesomeIcon icon={faSearch} />
          </InputGroup.Text>
          <Form.Control
            placeholder="Start typing..."
            onChange={onChangeSearch}
            type="text"
          ></Form.Control>
        </InputGroup>
      </Form.Group>
      <Form.Group>
        <Form.Label>Sort by</Form.Label>
        <Form.Select onChange={(e) => onChangeSort(e)}>
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
