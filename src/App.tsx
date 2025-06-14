import "./App.css";
import { Route, Router, Switch } from "wouter";
import HomePage from "./pages/HomePage";
import Header from "./Header";

function App() {
  return (
    <main className="container">
      <Header />
      <Router>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/accounts">Accounts page</Route>
          <Route path="/settings">Settings page</Route>
        </Switch>
      </Router>
    </main>
  );
}

export default App;
