import { Alert } from "store/redux/reducers/alerts";

export interface UseConnectReturn {
  alerts: Alert[];
  onCloseAlert: (id: string) => void;
}
