import { ChangeEvent, CSSProperties, KeyboardEvent, useState } from "react";
import { TextField } from "@mui/material";
import classnames from "classnames";

import { KEYS } from "constants/eventTarget";

import styles from "./EditableTitle.module.scss";

const { title: titleInitialClass, titleDisabled } = styles;

type EditableTitle = {
  isOpened: boolean;
  title: string;
  onChange: (value: string) => void;
  setIsOpened: (value: boolean) => void;
  style?: CSSProperties;
  titleClassName?: string;
  disabled?: boolean;
};

const EditableTitle = ({
  isOpened,
  title,
  onChange,
  style,
  setIsOpened,
  titleClassName,
  disabled,
}: EditableTitle) => {
  const [value, setValue] = useState(title);

  const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === KEYS.enter) {
      onChange(value);
    }
  };

  const onBlur = () => {
    onChange(value);
  };

  const onTitleClick = () => {
    if (disabled) {
      return;
    }

    setIsOpened(true);
  };

  return (
    <>
      {isOpened ? (
        <TextField
          fullWidth
          variant="standard"
          autoFocus
          value={value}
          onChange={onChangeValue}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          disabled={disabled}
          InputProps={{
            classes: {
              input: classnames(titleInitialClass, {
                [titleDisabled]: disabled,
              }),
            },
            style,
          }}
        />
      ) : (
        <div
          role="button"
          className={classnames(titleInitialClass, titleClassName, {
            [titleDisabled]: disabled,
          })}
          style={style}
          onClick={onTitleClick}
        >
          {title}
        </div>
      )}
    </>
  );
};

export default EditableTitle;
