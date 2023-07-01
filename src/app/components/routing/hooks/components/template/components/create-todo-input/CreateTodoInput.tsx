import { FC } from "react";
import { IconButton, TextField } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import classNames from "classnames";

import { createTodoInputHooks } from "./ducks";

import styles from "./CreateTodoInput.module.scss";

const { useConnect } = createTodoInputHooks;

const {
  wrapper,
  inputRoot,
  inputDisabled,
  labelRoot,
  labelDisabled,
  iconButton,
  addIcon,
  mobileWrapper,
  addIconDisabled,
} = styles;

interface Props {
  isDisabled?: boolean;
  isMobile?: boolean;
}

// No observer for mobx because of getting only action (no observables) from useConnect
const CreateTodoInput: FC<Props> = ({
  isMobile = false,
  isDisabled = false,
}) => {
  const { value, setValue, onCreateTodo, onKeyDown } = useConnect();

  return (
    <div className={classNames(wrapper, { [mobileWrapper]: isMobile })}>
      <TextField
        disabled={isDisabled}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        size="small"
        variant="standard"
        id="standard-basic"
        label="Create todo list"
        InputProps={{
          disabled: isDisabled,
          disableUnderline: true,
          classes: {
            root: inputRoot,
            disabled: inputDisabled,
          },
          endAdornment: value && (
            <IconButton
              size="small"
              className={iconButton}
              onClick={onCreateTodo}
              disabled={isDisabled}
            >
              <AddIcon
                className={classNames(addIcon, {
                  [addIconDisabled]: isDisabled,
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
    </div>
  );
};

export default CreateTodoInput;
