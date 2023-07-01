import React from "react";
import { observer } from "mobx-react-lite";
import { Alert } from "@mui/material";

import { alertsHooks } from "./ducks";

import styles from "./Alerts.module.scss";

const { wrapper, alertClass } = styles;

const { useConnect } = alertsHooks;

const Alerts = observer(() => {
  const { alerts, onCloseAlert } = useConnect();

  return (
    <div className={wrapper}>
      {alerts.map(({ id, message, type }) => (
        <Alert
          key={id}
          variant="filled"
          severity={type}
          onClose={() => onCloseAlert(id)}
          sx={{ marginTop: "10px" }}
          className={alertClass}
        >
          {message}
        </Alert>
      ))}
    </div>
  );
});

export default Alerts;
