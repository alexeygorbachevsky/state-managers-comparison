import logo from "assets/icons/logo.svg?url";

import styles from "./NotFoundPage.module.scss";

const { app, appHeader, appLogo } = styles;

const NotFoundPage = () => (
  <div className={app}>
    <header className={appHeader}>
      <img src={logo} className={appLogo} alt="logo" />
      <p>Nothing found</p>
    </header>
  </div>
);

export default NotFoundPage;
