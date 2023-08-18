import React from "react";
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface Props {
  data: object;
  show: boolean;
  handleClose: () => void;
  handleDelete: () => void;
  deleteEventsPrompt?: boolean;
  handleCheckboxChange?: () => void;
}

const DeleteModal = ({
  data,
  show,
  handleClose,
  handleDelete,
  deleteEventsPrompt,
  handleCheckboxChange,
}: Props) => {
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
        {deleteEventsPrompt && handleCheckboxChange && (
          <Form className="deleteAllEvents">
            <Form.Check
              name="delete_events"
              type="checkbox"
              id="delete_events"
              label="Delete all events from this tournament"
              onChange={handleCheckboxChange}
            />
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
