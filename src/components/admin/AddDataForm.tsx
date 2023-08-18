import React from "react";
import { Form, FormGroup, Button, Row, OverlayTrigger } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { renderAddEventsTooltip } from "../../global/tooltips";

export interface Input {
  id: number;
  name: string;
  cssClass: string;
  type: string;
  options?: any[][];
  defaultValues?: any[];
  label: string;
  note?: string;
}

interface Props {
  handleSubmit: (any) => void;
  inputs: Input[];
  objectName: string;
}

const AddDataForm = ({ handleSubmit, inputs, objectName }: Props) => {
  return (
    <Form onSubmit={handleSubmit} method="POST">
      {inputs.map((input) => {
        let field;
        if (input.type === "select" && input.options && input.defaultValues) {
          field = (
            <Form.Select
              name={input.name}
              defaultValue={input.defaultValues[0]}
            >
              {input.options[0].map((option) => (
                <option value={option}>{option}</option>
              ))}
            </Form.Select>
          );
        } else if (
          input.type === "doubleSelect" &&
          input.options &&
          input.defaultValues
        ) {
          let names = input.name.split(",");
          field = (
            <>
              <Form.Select
                name={names[0]}
                defaultValue={input.defaultValues[0]}
              >
                {input.options[0].map((option) => (
                  <option value={option}>{option}</option>
                ))}
              </Form.Select>
              <Form.Select
                name={names[1]}
                defaultValue={input.defaultValues[1]}
              >
                {input.options[1].map((option) => (
                  <option value={option}>{option}</option>
                ))}
              </Form.Select>
            </>
          );
        } else if (input.type === "eventsCheckbox") {
          field = (
            <Form.Check
              name={input.name}
              type={"checkbox"}
              id={"" + input.id}
              label={
                <>
                  Auto add events{" "}
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderAddEventsTooltip}
                  >
                    <FontAwesomeIcon icon={faCircleQuestion} />
                  </OverlayTrigger>
                </>
              }
            />
          );
        } else {
          field = <Form.Control name={input.name} type={input.type} />;
        }
        return (
          <Row>
            <FormGroup className={input.cssClass} controlId={"" + input.id}>
              {input.label != "" && <Form.Label>{input.label}</Form.Label>}
              {field}
              {input.note && (
                <Form.Text className="text-muted">{input.note}</Form.Text>
              )}
            </FormGroup>
          </Row>
        );
      })}
      <Row>
        <Button variant="primary" type="submit">
          Add {objectName}
        </Button>
      </Row>
    </Form>
  );
};

export default AddDataForm;
