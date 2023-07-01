import {
  FC,
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import debounce from "lodash/debounce";
import { IconButton, TextField } from "@mui/material";
import { Clear as ClearIcon } from "@mui/icons-material";
import classNames from "classnames";

import styles from "./Search.module.scss";

const {
  inputRoot,
  inputDisabled,
  labelRoot,
  labelDisabled,
  clearButton,
  clearIconDisabled,
  search,
} = styles;

interface Props {
  isDisabled: boolean;
  onChange: (text: string) => void;
  label: string;
}

const Search: FC<Props> = ({ isDisabled, onChange, label }) => {
  const [value, setValue] = useState("");
  const ref = useRef(null);

  const onSearchChangeLazy = useCallback(
    debounce(text => {
      onChange(text);
    }, 500),
    [],
  );

  useEffect(() => onSearchChangeLazy.cancel, []);

  const onSearchChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const searchText = e.target.value;
    setValue(searchText);
    onSearchChangeLazy(searchText);
  };

  const onClear = () => {
    onSearchChangeLazy.cancel();
    setValue("");
    onChange("");
  };

  return (
    <TextField
      ref={ref}
      value={value}
      onChange={onSearchChange}
      disabled={isDisabled}
      className={search}
      size="small"
      variant="standard"
      id="standard-basic"
      label={label}
      InputProps={{
        disableUnderline: true,
        classes: { root: inputRoot, disabled: inputDisabled },
        endAdornment: value && (
          <IconButton
            size="small"
            className={clearButton}
            aria-label="toggle password visibility"
            disabled={isDisabled}
            onClick={onClear}
          >
            <ClearIcon
              className={classNames({
                [clearIconDisabled]: isDisabled,
              })}
              fontSize="small"
            />
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
