import React from "react";
import { Table, CloseButton } from "react-bootstrap";

interface Props {
  rows: object[];
  titles: string[];
  handleDeleteButton: (object) => void;
}

const DataTable = ({ rows, titles, handleDeleteButton }: Props) => {
  return (
    <Table hover>
      <thead>
        <tr>
          {titles.map((title) => (
            <th key={title}>{title}</th>
          ))}
          <th></th> {/* For the close button column */}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row["id"]}>
            {Object.keys(row).map((key) => (
              <td key={key}>{row[key]}</td>
            ))}
            <td>
              <CloseButton onClick={() => handleDeleteButton(row)} />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default DataTable;
