import Header from "./components/Header";
import Button from "./components/Button";
import Alert from "./components/Alert";
import { useState } from "react";

function App() {
  const [message, setMessage] = useState("Welcome!");
  const [showAlert, setShowAlert] = useState(false);
  return (
    <>
      <Header />
      {showAlert && (
        <Alert onClose={() => setShowAlert(false)}>
          Quick! Dismiss this alert!
        </Alert>
      )}
      <h1>{message}</h1>
      <Button
        onClick={() => {
          setShowAlert(true);
          setMessage("You win!");
        }}
      >
        Click to <strong>win</strong>
      </Button>
    </>
  );
}

export default App;
