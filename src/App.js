import React, {Component } from 'react';
import Navbar from './Components/Navbar';
import Register from './Components/Register';
import Login from './Components/Login';
import Profile from './Components/Profile';
import Groups from './Components/Groups';
import WishList from './Components/WishList';
import { connect } from 'react-redux';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";


function PrivateRoute({ component: Component, ...rest }) {
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
              {loggedIn ?
                <Navbar {...this.props} />
              :
                null
              }
              <div>
                  <Route path='/register' exact render = {(props) => <Register {...props}  /> } />
                  <Route path='/profile' render = {(props) => loggedIn ? <Profile {...props} /> : <Redirect to='/'/> } />
                  <Route path='/wish-list/:id' render = {(props) => loggedIn ? <WishList {...props} /> : <Redirect to='/'/> } />
                  <Route path='/' exact render = {(props) => loggedIn ? <Redirect to='/groups/my-groups'/> : <Login {...props}  />} />
                  <PrivateRoute path='/groups' {...this.props} component = {Groups} />
              </div>
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