import { Table, CloseButton } from "react-bootstrap";

interface Props {
  rows: object[]; // list of all objects to display
  titles: string[]; // list of titles for each column
  responsive: boolean; // whether or not to enable horizontal scrolling for the table
  handleDeleteButton?: (object) => void; // how to handle clicking on a row's delete button
}

const DataTable = ({ rows, titles, handleDeleteButton, responsive }: Props) => {
  let cn;
  if (responsive) {
    cn = "longTable";
  } else {
    cn = "";
  }
  return (
    <div className="dataTable">
      <Table hover responsive={responsive}>
        <thead>
          <tr>
            {titles.map((title) => (
              <th key={title}>{title}</th>
            ))}
            {handleDeleteButton && <th></th>}{" "}
            {/* For the close button column */}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row["id"]} className={cn}>
              {Object.keys(row).map((key) => {
                if (row[key] != null && typeof row[key] === "object") {
                  return <td key={key}>{row[key].join(", ")}</td>;
                } else if (
                  typeof row[key] === "string" &&
                  row[key].substring(0, 21) === "https://www.start.gg/"
                ) {
                  return (
                    <td key={key}>
                      <a href={row[key]}>Link</a>
                    </td>
                  );
                } else {
                  return <td key={key}>{row[key]}</td>;
                }
              })}
              {handleDeleteButton && (
                <td>
                  <CloseButton onClick={() => handleDeleteButton(row)} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DataTable;
