import React, {Component } from 'react';
import Register from './Components/Register';
import Login from './Components/Login';
import Profile from './Components/Profile';
import { connect } from 'react-redux';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";

function PrivateRoute({ component: Component, ...rest }) {
    // console.log('PRIVATE ROUTE PROPS:', rest)
    return (
      <Route
        {...rest}
        render={props =>
           rest.loggedIn ? (
            <Component {...props} {...rest} />
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }
  

class Main extends Component {
    render() {
        const {loggedIn, new_user} = this.props;
        return (
          <Router>
            <div>
                <nav>
                    <div>
                        <ul>
                            <li>
                                <Link to="/register">Register</Link>
                            </li>
                            {/* <li>
                                <Link to="/login">Login</Link>
                            </li> */}
                            <li>
                                <Link to="/">{loggedIn ? 'Profile' : 'Login'}</Link>
                            </li>
                        </ul>
                    </div>
                </nav>

                <Route path='/register' exact render = {(props) => <Register {...props}  /> } />
                <Route path='/' exact render = {(props) => loggedIn ? <Redirect to='/profile'/> : <Login {...props}  />} />
                <PrivateRoute path='/profile' {...this.props} component = {Profile} />
            </div>
          </Router>
        ) 
    }
}

const mapStateToProps = state => {
    const { user: {user_info, loggedIn, new_user} } = state;
    return {
      user_info: user_info,
      loggedIn: loggedIn,
      new_user: new_user
    }
  }

  const mapDispatchToProps = dispatch => {
    return {
      dispatch
    }
  }
  
  
  const App = connect(
    mapStateToProps,
    mapDispatchToProps
  )(Main);
  
  

export default App;