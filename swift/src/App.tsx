import Home from "./views/Home";
import Permissions from "./views/Permissions";
import { AnimatePresence } from "framer-motion";
import { Switch, Route, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  console.log("Location", location);

  return (
    <AnimatePresence exitBeforeEnter>
      <Switch location={location} key={location.pathname}>
        <Route path="/" exact component={Home} />
        <Route path="/room/:roomName" exact component={Permissions} />
      </Switch>
    </AnimatePresence>
  );
}

export default App;
