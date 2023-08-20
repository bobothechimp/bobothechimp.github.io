import React from "react";
import {
  Form,
  FormGroup,
  Button,
  Row,
  OverlayTrigger,
  InputGroup,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { renderAddEventsTooltip } from "../../global/tooltips";

export interface Input {
  id: number; //ID of input field
  name: string; //Name of input for form
  cssClass: string; //Name of desired CSS class
  type: string; //Type of input field
  options?: any[][]; //For select fields, each element is a list of all options
  //for one of the dropdowns
  defaultValues?: any[]; //For select fields, each element is the default value
  //for the corresponding list in options
  preBuiltOptions?: boolean[]; //For select fields, each element is true if its
  //corresponding list of options is prebuilt
  //(i.e. needed to be generated in a special way)
  label: string; //Input label
  note?: string; //Note to appear below field
}

interface Props {
  handleSubmit: (any) => void;
  onChange: (any) => void;
  inputs: Input[];
  objectName: string;
}

const AddDataForm = ({ handleSubmit, onChange, inputs, objectName }: Props) => {
  return (
    <Form onSubmit={handleSubmit} method="POST">
      {inputs.map((input) => {
        let field;
        if (input.type === "select" && input.options && input.defaultValues) {
          if (input.preBuiltOptions) {
            field = (
              <Form.Select
                name={input.name}
                defaultValue={input.defaultValues[0]}
                onChange={onChange}
              >
                {input.options}
              </Form.Select>
            );
          } else {
            field = (
              <Form.Select
                name={input.name}
                defaultValue={input.defaultValues[0]}
                onChange={onChange}
              >
                {input.options[0].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Select>
            );
          }
        } else if (
          input.type === "doubleSelect" &&
          input.options &&
          input.defaultValues
        ) {
          let names = input.name.split(",");
          // Only way for IDE to stop complaining about input.defaultValues
          // and input.options possibly being undefined, even though I already
          // confirmed their existence in the else-if
          let dvs, ops;
          if (input.defaultValues) dvs = input.defaultValues;
          if (input.options) ops = input.options;
          field = (
            <InputGroup>
              {[0, 1].map((i) => (
                <Form.Select
                  key={i}
                  name={names[i]}
                  defaultValue={dvs[i]}
                  onChange={onChange}
                >
                  {ops[i].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
              ))}
            </InputGroup>
          );
        } else if (input.type === "eventsCheckbox") {
          field = (
            <Form.Check
              name={input.name}
              type={"checkbox"}
              id={"" + input.id}
              onChange={onChange}
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
          field = (
            <>
              <Form.Control
                required
                name={input.name}
                type={input.type}
                onChange={onChange}
              />
            </>
          );
        }
        return (
          <Row key={input.id}>
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
