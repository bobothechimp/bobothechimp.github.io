import { ReactNode } from "react";

interface Props {
  children: ReactNode; // children of Alert component, most-likely the alert message
  color?: string; // color of alert, defaulted to "danger"
  onClose: () => void; // how to handle closing the alert
}

const Alert = ({ children, color = "danger", onClose }: Props) => {
  return (
    <div
      className={"alert alert-" + color + " alert-dismissible fade show"}
      role="alert"
    >
      {children}
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        onClick={onClose}
      ></button>
    </div>
  );
};

export default Alert;
