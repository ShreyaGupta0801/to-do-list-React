import { BrowserRouter as Switch, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import TaskList from "./components/TaskList";
import Unauthorized from "./components/Unauthorized";
import FullTask from "./components/FullTask";



function App() {
  return (
    <Switch>
      <Route path="/" exact component={Home}></Route>
      <Route path="/login" exact component={Login}></Route>
      <Route path="/signup" exact component={Signup}></Route>
      <Route path="/notes" exact component={TaskList} ></Route>
      <Route path="/edit-note" exact component={FullTask} ></Route>
      <Route path="/unauthorized" exact component={Unauthorized}></Route>
    </Switch>
  );
}

export default App;