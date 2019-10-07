import React, {Component} from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { connect } from 'react-redux';
import { login, userExistsError, connectionError} from '../../actions/UserActions';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import CreateGroup from './CreateGroup';
import JoinGroup from './JoinGroup';


class Groups extends Component {
  constructor(props) {
    super(props)
    this.state={
      userGroups: [],
      selectedUsersData: [],
      selectedUserId: null,
      selectedUserName: null,
      selectUserErr: false,
      registrationError: false,
      connectionError: false
    }
  }

  componentDidMount() {
    this.setState({
      selectedUserId: this.props.user_info.uidSelected,
      selectedUserName: this.props.user_info.selectedUserName
    }, () => {
      console.log('SELECTED USER:', this.state.selectedUserName)
      this.getUserGroups(this.props.user_info._id);
      this.getSelectedUsersData(this.state.selectedUserId);
    })
    
  }

  componentDidUpdate(prevProps) {
    if(prevProps.loggedIn !== this.props.loggedIn) {
      this.props.history.push('/profile');
    }
  }
  

  getUserGroups = (userId) => {
    axios.get('http://localhost:3001/api/getUserGroups', {
      params: {
        user_id: userId
      }
    })
      .then((res) => {
        this.setState({ userGroups: res.data }, () => {
          console.log('USERS GROUPS:', this.state.userGroups)
        })
    })
    .catch(error => {
      console.log('AXIOS GET USER GROUPS ERROR', error)
    })
  };

  getSelectedUsersData = (id) => {
    axios.get('http://localhost:3001/api/getSelectedUsersItems', {
      params: {
        user_id: id
      }
    })
      .then((res) => this.setState({ selectedUsersData: res.data }, () => {console.log('SELECTED USERS DATA:', this.state.selectedUsersData)}))
  };


  deleteGroup = (idTodelete) => {
    let component = this;

    // console.log('ID OF GROUP>', idTodelete)
    axios.delete('http://localhost:3001/api/deleteGroup', {
      data: {
        _id: idTodelete,
      },
    })
    .then(function (response) {
      // console.log('AXIOS RESPONSE:', response)
      component.getUserGroups(component.props.user_info._id);
    })
    .catch(function (error) {
      // console.log('AXIOS ERROR:', error)
    })
    ;
  };
  
  clearSelections = (groupId) => {
    let component = this;

    // console.log('ID OF GROUP>', idTodelete)
    axios.post('http://localhost:3001/api/clearSelections', {
      data: {
        group_id: groupId,
      },
    })
    .then(function (response) {
      // console.log('AXIOS RESPONSE:', response)
      component.getUserGroups(component.props.user_info._id);
    })
    .catch(function (error) {
      // console.log('AXIOS ERROR:', error)
    })
    ;
  };

  removeMember = (groupId, userId) => {
    let component = this;

    axios.delete('http://localhost:3001/api/removeMember', {
      data: {
        group_id: groupId,
        uid: userId,
      },
    })
    .then(function (response) {
      // console.log('AXIOS RESPONSE:', response)
      component.getUserGroups(component.props.user_info._id);
    })
    .catch(function (error) {
      // console.log('AXIOS ERROR:', error)
    })
    ;
  };

  drawName = (groupId, userId) => {
    let component = this;

    console.log('GROUP ID:', groupId)
    console.log('USER ID:', userId)
    axios.post('http://localhost:3001/api/selectUser', {
      group_id: groupId,
      user_id: userId
    })
    .then(function (response) {
      // console.log('DRAW NAME AXIOS RESPONSE:', response)
       if (response.data === '') {
          console.log('SELECT USER ERROR!!')
      }
      else {
        console.log('USER SELECTED:', response)
        component.getUserGroups(component.props.user_info._id);
        // component.getSelectedUsersData(response.data._id);
      }
        
    })
    .catch(function (error) {
      console.log('DRAW NAME AXIOS ERROR:', error)
    })
  } 

  render() {
    const { user_info } = this.props;

    return (
        <div>
            {this.state.userGroups.length <= 0 ? 
              <div>
                <h3>You haven't joined any groups yet!</h3>
                <p>Create a group or click the "Join Group" tab to join a group.</p>
              </div>
              :
              this.state.userGroups.map((group, idx) => {
              return (
                <div key={idx}>
                  <h4 key={idx}>{group.name}</h4>
                  <p>Waiting on {group.memberCount} more people to join.</p>
                  {group.admin === user_info._id ?
                  <div>
                    <button onClick={() => this.deleteGroup(group._id)}>Delete Group</button>
                    <button onClick={() => this.clearSelections(group._id)}>Clear Selections</button>
                  </div>
                    :
                    null
                  }
                  <ul>
                    {group.members.map((member, index) => {
                      if ((member.uid !== user_info._id) && (group.admin === user_info._id)) {
                        return (
                          <div key={index}>
                            {member.selectedBy === this.props.user_info._id ?
                                 <li key={index}>{member.name} :)</li>
                              :
                                <li key={index}>{member.name}</li>
                            }
                            <span>
                              <button onClick={() => this.removeMember(group._id, member.uid)}>Remove member</button>
                            </span>
                          </div>
                          )
                      }
                      else if ((member.uid === user_info._id) && (group.admin !== user_info._id)) {
                        return (
                          <div key={index}>
                            {member.selectedBy === this.props.user_info._id ?
                                 <li key={index}>{member.name} :)</li>
                              :
                                <li key={index}>{member.name}</li>
                            }
                            <span>
                              <button onClick={() => this.removeMember(group._id, member.uid)}>Leave Group</button>
                            </span>
                          </div>
                          )
                      }
                      else {
                        return (
                          <div key={index}>
                            {member.selectedBy === this.props.user_info._id ?
                                 <li key={index}>{member.name} :)</li>
                              :
                                <li key={index}>{member.name}</li>
                            }
                          </div>
                          )
                      }
                    })}
                  </ul>

                  <div>
                      <h3>Draw Name</h3>
                      <div>
                        <button onClick={() => this.drawName(group._id, this.props.user_info._id)}>Draw</button>
                      </div>
                    </div>

                  {/* {group.memberCount === 0 ?
                    <div>
                      <h3>Draw Name</h3>
                      <div>
                        <button onClick={() => this.drawName(this.props.user_info._id)}>Draw</button>
                      </div>
                    </div>
                    :
                    <div>
                    <h3>When everyone joins the group, you can draw a name here.</h3>
                    </div>
                    } */}
                </div>
              )
            })}
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