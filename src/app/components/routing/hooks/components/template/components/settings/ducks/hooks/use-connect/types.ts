import { ChangeEvent } from "react";
import { SelectChangeEvent } from "@mui/material";

import { DelaysType } from "constants/sessionStorage";

export interface UseConnectReturn {
  isSessionStorage: boolean;
  loadDelay: DelaysType;
  onSwitchChange: (
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void;
  onDelayChange: (event: SelectChangeEvent) => void;
}
