import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { CircularProgress } from "@mui/material";

import { ROUTES } from "constants/routes";
import { STATE_MANAGERS, StateManagersContext } from "constants/state-managers";

import styles from "./Routing.module.scss";

import { useProvider } from "./hooks";

const { loaderWrapper } = styles;

const NotFoundPage = lazy(
  () => import(/* webpackChunkName: "NotFoundPage" */ "pages/not-found"),
);

const Routing = () => {
  const {
    stateManager,
    template,
    todoListsPage,
    // todoListsPage2,
    StoreProvider,
  } = useProvider();

  return (
    <StateManagersContext.Provider
      value={stateManager as STATE_MANAGERS.reduxToolkit}
    >
      <StoreProvider>
        <Suspense
          fallback={
            <div className={loaderWrapper}>
              <CircularProgress thickness={2.5} size={64} />
            </div>
          }
        >
          <Routes>
            <Route path={ROUTES.home} element={template}>
              <Route index element={todoListsPage} />
              {/*{todoListsPage2 && (*/}
              {/*  <Route path={ROUTES.home2} element={todoListsPage2} />*/}
              {/*)}*/}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </StoreProvider>
    </StateManagersContext.Provider>
  );
};

export default Routing;
