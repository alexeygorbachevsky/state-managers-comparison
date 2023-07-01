import { FC, Fragment } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { ArrowDropDown as ArrowDropDownIcon } from "@mui/icons-material";
import classNames from "classnames";

import {
  STATE_AND_QUERY_MANAGERS_OPTIONS,
  DEFAULT_STATE_MANAGERS_OPTION,
  DEFAULT_STATE_MANAGERS_NAME,
  STATE_MANAGERS_OPTIONS_LIST,
  STATE_AND_QUERY_MANAGERS_TYPE,
} from "constants/state-managers";
import { SESSION_STORAGE_ITEMS } from "constants/sessionStorage";

import styles from "./StateManagerSelect.module.scss";

const {
  inputRoot,
  labelRoot,
  clearIndicator,
  popupIndicator,
  inputDisabled,
  labelDisabled,
  popupIconDisabled,
  groupHeader,
} = styles;

interface Props {
  value: STATE_AND_QUERY_MANAGERS_TYPE;
  onChange: (name: STATE_AND_QUERY_MANAGERS_TYPE) => void;
  isDisabled?: boolean;
}

const StateManagerSelect: FC<Props> = ({ value, onChange, isDisabled }) => (
  <Autocomplete
    disabled={isDisabled}
    color="white"
    disablePortal
    id="combo-box-demo"
    options={STATE_MANAGERS_OPTIONS_LIST}
    groupBy={option => option.group}
    value={STATE_AND_QUERY_MANAGERS_OPTIONS[value]}
    onChange={(event, value) => {
      if (!value) {
        onChange(DEFAULT_STATE_MANAGERS_NAME);

        sessionStorage.setItem(
          SESSION_STORAGE_ITEMS.stateManagerName,
          DEFAULT_STATE_MANAGERS_NAME,
        );

        return;
      }

      onChange(value.label);

      sessionStorage.setItem(
        SESSION_STORAGE_ITEMS.stateManagerName,
        value.label,
      );
    }}
    defaultValue={DEFAULT_STATE_MANAGERS_OPTION}
    sx={{
      width: 200,
      marginRight: "20px",
    }}
    classes={{
      clearIndicator,
      popupIndicator,
    }}
    popupIcon={
      <ArrowDropDownIcon
        className={classNames({
          [popupIconDisabled]: isDisabled,
        })}
      />
    }
    renderInput={params => (
      <TextField
        {...params}
        disabled={isDisabled}
        size="small"
        variant="standard"
        label="Choose state manager"
        InputProps={{
          ...params.InputProps,
          disableUnderline: true,
          classes: {
            root: inputRoot,
            disabled: inputDisabled,
          },
        }}
        InputLabelProps={{
          ...params.InputLabelProps,
          classes: {
            root: labelRoot,
            disabled: labelDisabled,
          },
        }}
      />
    )}
    renderGroup={params => (
      <Fragment key={params.key}>
        <div className={groupHeader}>{params.group}</div>
        <div>{params.children}</div>
      </Fragment>
    )}
  />
);

export default StateManagerSelect;
