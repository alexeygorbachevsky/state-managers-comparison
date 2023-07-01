import { FC, useState } from "react";
import { observer } from "mobx-react-lite";
import { Outlet } from "react-router-dom";
import {
  AppBar,
  Box,
  IconButton,
  LinearProgress,
  List,
  SwipeableDrawer,
  Toolbar,
} from "@mui/material";
import { Close as CloseIcon, Menu as MenuIcon } from "@mui/icons-material";

import { Search } from "components";

import { useSize } from "hooks";

import { STATE_AND_QUERY_MANAGERS_TYPE } from "constants/state-managers";

import { templateHooks } from "./ducks";
import { CreateTodoInput, Settings, StateManagerSelect } from "./components";

import styles from "./Template.module.scss";

const { toolbar, mobileToolbar, sidebarBox, closeSidebarButton } = styles;
const { useConnect } = templateHooks;

interface Props {
  stateManager: STATE_AND_QUERY_MANAGERS_TYPE;
  onChangeStateManager: (name: STATE_AND_QUERY_MANAGERS_TYPE) => void;
  isStateManagerSupported: boolean;
}

const Template: FC<Props> = observer(
  ({ stateManager, onChangeStateManager, isStateManagerSupported }) => {
    const { isTodosReordering, isCreatingTodo, isDisabled, onSearchChange } =
      useConnect(stateManager);

    const [isOpened, setIsOpened] = useState(false);
    const { isMobileWidth, isTabletSmall } = useSize();

    const isMobileVersion = isMobileWidth || isTabletSmall;

    const stateManagerSelect = (
      <StateManagerSelect
        isDisabled={isDisabled}
        value={stateManager}
        onChange={onChangeStateManager}
      />
    );

    return (
      <>
        <AppBar>
          {isMobileVersion ? (
            <div className={mobileToolbar}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => setIsOpened(true)}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
              {isStateManagerSupported && <Settings isDisabled={isDisabled} />}
              <SwipeableDrawer
                anchor="left"
                open={isOpened}
                onOpen={() => setIsOpened(true)}
                onClose={() => setIsOpened(false)}
              >
                <Box className={sidebarBox}>
                  <IconButton
                    className={closeSidebarButton}
                    color="inherit"
                    aria-label="open drawer"
                    onClick={() => setIsOpened(false)}
                    edge="start"
                    sx={{ mr: 2 }}
                  >
                    <CloseIcon />
                  </IconButton>
                  <List>
                    {stateManagerSelect}
                    {isStateManagerSupported && (
                      <>
                        <CreateTodoInput isDisabled={isDisabled} isMobile />
                        <Search
                          isDisabled={isDisabled}
                          label="Search todo list"
                          onChange={onSearchChange}
                        />
                      </>
                    )}
                  </List>
                </Box>
              </SwipeableDrawer>
            </div>
          ) : (
            <Toolbar className={toolbar}>
              {stateManagerSelect}
              {isStateManagerSupported && (
                <>
                  <CreateTodoInput isDisabled={isDisabled} />
                  <Search
                    isDisabled={isDisabled}
                    label="Search todo list"
                    onChange={onSearchChange}
                  />
                  <Settings isDisabled={isDisabled} />
                </>
              )}
            </Toolbar>
          )}
          {(isCreatingTodo || isTodosReordering) && <LinearProgress />}
        </AppBar>
        <Outlet />
      </>
    );
  },
);

export default Template;
