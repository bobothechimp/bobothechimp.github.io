import React from "react";
import { Table, CloseButton } from "react-bootstrap";

interface Props {
  rows: object[];
  titles: string[];
  responsive: boolean;
  handleDeleteButton: (object) => void;
}

const DataTable = ({ rows, titles, handleDeleteButton, responsive }: Props) => {
  let cn;
  if (responsive) {
    cn = "longTable";
  } else {
    cn = "";
  }
  return (
    <Table hover responsive={responsive}>
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
          <tr key={row["id"]} className={cn}>
            {Object.keys(row).map((key) => {
              if (row[key] != null && typeof row[key] === "object") {
                return <td key={key}>{row[key].join(", ")}</td>;
              } else {
                return <td key={key}>{row[key]}</td>;
              }
            })}
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
