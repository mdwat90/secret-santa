import React, { Component } from 'react';
import Navbar from './Components/Navbar';
import Register from './Components/Register';
import Login from './Components/Login';
import Profile from './Components/Profile';
import Groups from './Components/Groups';
import WishList from './Components/WishList';
import ResetPassword from './Components/ResetPassword';
import ResetLink from './Components/ResetLink';
import { connect } from 'react-redux';

import {
  HashRouter,
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom';

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        rest.loggedIn ? (
          <Component {...props} {...rest} />
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}

class Main extends Component {
  render() {
    const { loggedIn } = this.props;
    return (
      <HashRouter basename="/">
        <Router>
          <div>
            {loggedIn ? <Navbar {...this.props} /> : null}
            <div>
              <Route
                path="/register"
                exact
                render={(props) => <Register {...props} />}
              />
              <Route
                path="/profile"
                render={(props) =>
                  loggedIn ? <Profile {...props} /> : <Redirect to="/" />
                }
              />
              <Route
                path="/wish-list/:id"
                render={(props) =>
                  loggedIn ? <WishList {...props} /> : <Redirect to="/" />
                }
              />
              <Route
                path="/"
                exact
                render={(props) =>
                  loggedIn ? (
                    <Redirect to="/groups/my-groups" />
                  ) : (
                    <Login {...props} />
                  )
                }
              />
              <Route
                path="/reset-link"
                render={(props) => <ResetLink {...props} />}
              />
              <Route
                path="/reset-password/:id"
                render={(props) => <ResetPassword {...props} />}
              />
              <PrivateRoute path="/groups" {...this.props} component={Groups} />
            </div>
          </div>
        </Router>
      </HashRouter>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    user: { user_info, loggedIn, new_user },
  } = state;
  return {
    user_info: user_info,
    loggedIn: loggedIn,
    new_user: new_user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

const App = connect(mapStateToProps, mapDispatchToProps)(Main);

export default App;
