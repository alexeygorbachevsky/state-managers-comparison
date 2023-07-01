import { useState } from "react";
import { TextField, IconButton } from "@mui/material";
import { Clear as ClearIcon } from "@mui/icons-material";

import styles from "./Search.module.scss";

const {
  inputRoot,
  inputDisabled,
  labelRoot,
  labelDisabled,
  clearButton,
  search,
} = styles;

const Search = () => {
  const [value, setValue] = useState("");

  return (
    <TextField
      className={search}
      value={value}
      onChange={e => setValue(e.target.value)}
      size="small"
      variant="standard"
      id="standard-basic"
      label="Search todo list"
      InputProps={{
        disableUnderline: true,
        classes: { root: inputRoot, disabled: inputDisabled },
        endAdornment: value && (
          <IconButton
            size="small"
            className={clearButton}
            aria-label="toggle password visibility"
            onClick={() => setValue("")}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        ),
      }}
      InputLabelProps={{
        classes: { root: labelRoot, disabled: labelDisabled },
      }}
    />
  );
};

export default Search;
