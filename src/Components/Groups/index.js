import React, {Component} from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { connect } from 'react-redux';
import { login, userExistsError, connectionError} from '../../actions/UserActions';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import CreateGroup from './CreateGroup';
import JoinGroup from './JoinGroup';
import MyGroups from './MyGroups';
  

class Groups extends Component {
  constructor(props) {
    super(props)
    // this.state={
    //   registered: false,
    //   loggedIn: this.props.loggedIn,
    //   registrationError: false,
    //   connectionError: false
    // }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.loggedIn !== this.props.loggedIn) {
      this.props.history.push('/profile')
    }
  }
  

  createGroup = (data) => {
    const component = this;

    axios.post('http://localhost:3001/api/newUser', {
      data
    })
    .then(function (response) {
      // console.log('AXIOS RESPONSE:', response)
      if(response.data._id){
        component.props.login(response.data)
      }
      else if(!response.data._id){
        component.props.userExistsError();
      }
    })
    .catch(function (error) {
      // console.log('AXIOS ERROR:', error)
      component.props.connectionError(error);
    })
  }

  getUsersGroups = (userId) => {
      
  }

  render() {
    return (
        <div>
            <nav>
                <div>
                    <ul>
                        {/* <li>
                            <Link to="/groups/my-groups">My Groups</Link>
                        </li> */}
                        <li>
                            <Link to="/groups/create-group">Create Group</Link>
                        </li>
                        <li>
                            <Link to="/groups/join-group">Join Group</Link>
                        </li>
                    </ul>
                </div>
            </nav>

            <Route path='/groups/my-groups' render = {(props) => <MyGroups {...props}  /> }/>
            <Route path='/groups/create-group' render = {(props) => <CreateGroup {...props}  /> }/>
            <Route path='/groups/join-group' render = {(props) => <JoinGroup {...props}  /> } />
        </div>

    )
  }
}

const mapStateToProps = state => {
  const { user: {user_info, loggedIn, userExistsErr, connectionErr } } = state;

  return {
    user_info: user_info,
    loggedIn: loggedIn,
    userExistsErr: userExistsErr,
    connectionErr: connectionErr
  }
}

const mapDispatchToProps = {
  login,
  userExistsError,
  connectionError
}


const GroupsScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(Groups);


export default GroupsScreen;