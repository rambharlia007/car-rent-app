import React, { Component } from "react";
import "./App.css";
import Login from "./component/Login";
import Header from "./component/Header";
import Home from "./component/Home";
import Register from "./component/Register";

import { BrowserRouter as Router, Link } from "react-router-dom";
import Route from "react-router-dom/Route";
import PrivateRoute from "./component/PrivateRoute";
import CommonService from "./services/common";

var commonService = new CommonService();

class App extends Component {
  state = { isAuthenticated: false, isAdmin: false };
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (true || commonService.getLocalStorageData("token")) {
      this.setState({ isAuthenticated: true });
    }
  }

  authenticateCallBackHandler = () => {
    this.setState({ isAuthenticated: true });
  };

  render() {
    return (
      <Router>
        <div>
          {this.state.isAuthenticated && <Header />}
          <Route
            path="/login"
            exact
            strict
            render={props => {
              return (
                <Login
                  {...props}
                  authenticateCallBack={this.authenticateCallBackHandler}
                  isAuthenticated={this.state.isAuthenticated}
                />
              );
            }}
          />
          <main>
            <div>
              <PrivateRoute
                exact
                path="/register"
                isAuthenticated={this.state.isAuthenticated}
                component={Register}
              />
              <PrivateRoute
                exact
                path="/"
                isAuthenticated={this.state.isAuthenticated}
                component={Home}
              />
            </div>
          </main>
        </div>
      </Router>
    );
  }
}

export default App;
