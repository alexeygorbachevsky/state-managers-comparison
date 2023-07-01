import { BrowserRouter } from "react-router-dom";

import { ErrorBoundary } from "components";

import { Routing } from "./components";

const App = () => (
  <ErrorBoundary>
    <BrowserRouter>
      <Routing />
    </BrowserRouter>
  </ErrorBoundary>
);

export default App;

// TODO: react context renders example
// export { default } from "./ReactContextExample";
