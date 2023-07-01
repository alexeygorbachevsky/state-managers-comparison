import { DelaysType } from "constants/sessionStorage";


export interface ExtraInitialState {
  search: string;
  isSessionStorage: boolean;
  loadDelay: DelaysType;
}
