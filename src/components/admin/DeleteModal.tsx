import React from "react";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";

interface Props {
  data: object;
  show: boolean;
  handleClose: () => void;
  handleDelete: () => void;
}

const DeleteModal = ({ data, show, handleClose, handleDelete }: Props) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Are you sure?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete the following object?
        <table cellPadding={6}>
          <tbody>
            {Object.keys(data).map((key) => {
              if (data[key] != null && typeof data[key] === "object") {
                return (
                  <tr key={key}>
                    <th>{key}</th>
                    <td>{data[key].join(", ")}</td>
                  </tr>
                );
              } else {
                return (
                  <tr key={key}>
                    <th>{key}</th>
                    <td>{data[key]}</td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
