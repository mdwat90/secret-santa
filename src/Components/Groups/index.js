import React, {Component} from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { connect } from 'react-redux';
import { login, userExistsError, connectionError} from '../../actions/UserActions';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import CreateGroup from './CreateGroup';
import JoinGroup from './JoinGroup';
import MyGroups from './MyGroups';
import { withStyles } from '@material-ui/styles';
import { Button, Container, Box, Typography, TextField, Card, CardActionArea } from '@material-ui/core';
  
const styles = {
  root: {
    background: '#fff',
    margin: 'auto',
    height: '100vh'
  },
  container: {
    background: '#fff',
    textAlign: 'center',
    width: '100%',
    marginTop: '5vh',
    paddingBottom: '10vh'
  },
  title: {
    paddingTop: '5vh',
  },
  link: {
    margin: '2vh',
  },
  textInput: {
    margin: '1vh',
    width: '80%'
  },
  
};

class Groups extends Component {
  constructor(props) {
    super(props)
  }

  componentDidUpdate(prevProps) {
    window.scrollTo(0, 0);
    if(prevProps.loggedIn !== this.props.loggedIn) {
      this.props.history.push('/profile')
    }
  }
  

  createGroup = (data) => {
    const component = this;

    axios.post('/api/newUser', {
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
    const {classes} = this.props;

    return (
        <Box className={classes.root}>
            <Container className={classes.container}>
              <Route path='/groups/my-groups' render = {(props) => <MyGroups {...props}  /> }/>
              <Route path='/groups/create-group' render = {(props) => <CreateGroup {...props}  /> }/>
              <Route path='/groups/join-group' render = {(props) => <JoinGroup {...props}  /> } />
            </Container>
        </Box>

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


export default withStyles(styles)(GroupsScreen);