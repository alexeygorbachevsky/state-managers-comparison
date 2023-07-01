import { FC, useState, MouseEvent } from "react";
// import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
  IconButton,
  Box,
  SwipeableDrawer,
  List,
  FormControlLabel,
  FormControl,
  Switch,
  Tooltip,
  InputLabel,
  MenuItem,
  Select,
  Popper,
  ClickAwayListener,
  Paper,
  Typography,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  NotificationsNone as NotificationsNoneIcon,
  GitHub as GitHubIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import classnames from "classnames";

import { DELAYS } from "constants/sessionStorage";
// import { ROUTES } from "constants/routes";

import { settingsHooks } from "./ducks";

import styles from "./Settings.module.scss";

const { useConnect } = settingsHooks;

const {
  sidebarBox,
  closeSidebarButton,
  settingsButtonWrapper,
  notificationButton,
  githubButtonDisabled,
  selectClass,
  selectLabel,
  selectIcon,
  // linksList,
  // link,
  // linkText
} = styles;

interface Props {
  isDisabled: boolean;
}

const Settings: FC<Props> = observer(({ isDisabled }) => {
  const { isSessionStorage, loadDelay, onSwitchChange, onDelayChange } =
    useConnect();

  const [isOpened, setIsOpened] = useState(false);
  const [notificationsAnchor, setNotificationsAnchor] =
    useState<null | HTMLElement>(null);

  const loadDelayIndex = DELAYS.findIndex(delay => delay === loadDelay);

  const onToggleNotifications = (event: MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(prevNotificationsAnchor =>
      prevNotificationsAnchor ? null : event.currentTarget,
    );
  };

  const onClickAwayNotifications = () => {
    setNotificationsAnchor(null);
  };

  return (
    <div
      className={classnames(settingsButtonWrapper, {
        [githubButtonDisabled]: isDisabled,
      })}
    >
      <Tooltip title="GitHub repository">
        <div>
          <IconButton
            color="inherit"
            aria-label="open github repo"
            disabled={isDisabled}
            href="https://github.com/alexeygorbachevskiy/state-managers"
            target="_blank"
          >
            <GitHubIcon />
          </IconButton>
        </div>
      </Tooltip>
      <ClickAwayListener onClickAway={onClickAwayNotifications}>
        <div>
          <Tooltip title="Show description">
            <div>
              <IconButton
                className={notificationButton}
                color="inherit"
                aria-label="open notifications"
                disabled={isDisabled}
                onClick={onToggleNotifications}
              >
                <NotificationsNoneIcon />
              </IconButton>
            </div>
          </Tooltip>
          <Popper
            id="notifications-popper"
            open={Boolean(notificationsAnchor)}
            anchorEl={notificationsAnchor}
            style={{ zIndex: 10000 }}
            placement="bottom-end"
          >
            <Paper sx={{ p: 2, width: 300 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                State managers comparison
              </Typography>
              <Typography variant="body2" sx={{ color: "rgb(62, 80, 96)" }}>
                Set of identical todo lists written via different state
                managers.
              </Typography>
            </Paper>
          </Popper>
        </div>
      </ClickAwayListener>
      <Tooltip title="Show settings">
        <div>
          <IconButton
            color="inherit"
            aria-label="open settings"
            disabled={isDisabled}
            onClick={() => setIsOpened(true)}
          >
            <SettingsIcon />
          </IconButton>
        </div>
      </Tooltip>
      <SwipeableDrawer
        anchor="right"
        open={isOpened}
        onOpen={() => setIsOpened(true)}
        onClose={() => setIsOpened(false)}
      >
        <Box className={sidebarBox}>
          <IconButton
            className={closeSidebarButton}
            color="inherit"
            aria-label="open settings"
            onClick={() => setIsOpened(false)}
            edge="start"
            sx={{ mr: 2 }}
          >
            <CloseIcon />
          </IconButton>
          <List>
            <FormControlLabel
              disabled={isDisabled}
              labelPlacement="start"
              control={
                <Switch
                  checked={isSessionStorage}
                  onChange={onSwitchChange}
                  color="error"
                />
              }
              label="Session storage"
              sx={{
                ml: 0,
                color: "white",
                cursor: isDisabled ? "not-allowed !important" : "pointer",
              }}
            />
            <FormControl
              variant="standard"
              sx={{
                marginTop: "20px",
                color: "white",
                width: 170,
                cursor: isDisabled ? "not-allowed !important" : "pointer",
              }}
              disabled={isDisabled}
            >
              <InputLabel
                id="delay-select-label"
                classes={{ root: selectLabel }}
              >
                Load delay
              </InputLabel>
              <Select
                labelId="delay-select-label"
                value={String(loadDelayIndex)}
                onChange={onDelayChange}
                label="Load delay"
                classes={{
                  select: selectClass,
                  icon: selectIcon,
                }}
                disableUnderline
              >
                {DELAYS.map((delay, index) => (
                  <MenuItem key={delay} value={index}>
                    {delay} ms
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </List>
          {/*<>*/}
          {/*  <Typography sx={{ color: "#ffffff", marginTop: "20px" }}>*/}
          {/*    Compare caching:*/}
          {/*  </Typography>*/}
          {/*  <ul className={linksList}>*/}
          {/*    <li>*/}
          {/*      <Link to={ROUTES.home} className={link}>*/}
          {/*        <Typography className={linkText}>Page 1</Typography>*/}
          {/*      </Link>*/}
          {/*    </li>*/}
          {/*    <li>*/}
          {/*      <Link to={ROUTES.home2} className={link}>*/}
          {/*        <Typography className={linkText}>Page 2</Typography>*/}
          {/*      </Link>*/}
          {/*    </li>*/}
          {/*  </ul>*/}
          {/*</>*/}
        </Box>
      </SwipeableDrawer>
    </div>
  );
});

export default Settings;
