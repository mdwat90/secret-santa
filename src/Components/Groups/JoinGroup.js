import React, {Component} from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { connect } from 'react-redux';
import { connectionError } from '../../actions/UserActions';
import { joinGroupError } from '../../actions/GroupActions';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { withStyles } from '@material-ui/styles';
import { Button, Container, Box, Typography, TextField } from '@material-ui/core';

const styles = {
  root: {
    background: '#fff',
    margin: 'auto',
    // height: '100vh',
    // paddingTop: '15vh'
  },
  form: {
    background: '#fff',
    textAlign: 'center',
    width: '60%',
    height: '80%',
    borderRadius: 5
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
  button: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    // width: '25%',
    padding: '0 30px',
    margin: '5vh'
  },
};

class JoinGroup extends Component {
  constructor(props) {
    super(props)
    this.state={
      groupJoined: false
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.loggedIn !== this.props.loggedIn) {
      this.props.history.push('/profile')
    }
  }

  JoinGroup = (data) => {
    const component = this;

    console.log('CLIENT GROUP DATA:', data)

    axios.post('http://localhost:3001/api/joinGroup', {
      data: {
        uid: data.uid,
        name: data.name.trim(),
        group: data.group.trim(),
        password: data.password.trim()
      }
    })
    .then(function (response) {
      console.log('AXIOS RESPONSE:', response)
      if(response.data._id){
        component.setState({
          groupJoined: !component.state.groupJoined
        });
        setTimeout(function() {
          component.props.history.push('/groups/my-groups')
        }, 1500)
      }
      else if(!response.data._id){
        component.props.joinGroupError();
      }
    })
    .catch(function (error) {
      console.log('AXIOS ERROR:', error)
      component.props.connectionError(error);
    })
  }


  render() {
    const {user_info, classes } = this.props;

    return (
      this.state.groupJoined ? 
        <div>
          <Typography variant='h4'>You have joined the group!</Typography>
        </div>
        :
        <Box className={classes.root}>
          <Container className={classes.form}>
            <Formik
              initialValues={{ uid: user_info._id, name: '', group: '',  password: '' }}
              validate={values => {
                let errors = {};
                if (!values.name) {
                  errors.name = 'Required';
                }
                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                this.JoinGroup(values);
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting
              }) => (
                <form onSubmit={handleSubmit}>
                  {errors.admin}
                    <Typography variant='h5' className={classes.title}>Join Group</Typography>
                  <div>
                    {/* <Typography variant='h5' className={classes.title}>Your Name</Typography> */}
                    <TextField
                      required
                      type="name"
                      name="name"
                      id="standard-required"
                      label="Your Name"
                      placeholder={'Your Name'}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      className={classes.textInput}
                    />
                  </div>
                  <div>
                    {/* <Typography style={{color: 'red'}}>{errors.name}</Typography> */}
                  </div>
                  <div>
                    {/* <Typography variant='h5' className={classes.title}>Group Name</Typography> */}
                    <TextField
                      required
                      type="name"
                      name="group"
                      id="standard-required"
                      label="Group Name"
                      placeholder={'Group Name'}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.group}
                      className={classes.textInput}
                    />
                  </div>
                  <div>
                    {/* <Typography style={{color: 'red'}}>{errors.group}</Typography> */}
                  </div>
                  <div>
                    {/* <Typography variant='h5' className={classes.title}>Password</Typography> */}
                    <TextField
                      required
                      type="password"
                      name="password"
                      id="standard-password-input"
                      label="Password"
                      placeholder={'Password'}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      className={classes.textInput}
                    />
                  </div>
                  <div>
                    {/* <Typography style={{color: 'red'}}>{errors.password}</Typography> */}
                  </div>
                  <div>
                    <Button type="submit" className={classes.button}>
                      Join Group
                    </Button>
                  </div>
                </form>
              )}
            </Formik>

            <Typography>
              <Link to="/groups/create-group" className={classes.link} style={{ textDecoration: 'none', color: '#4f92ff' }}>
                Haven't created a group? You can create one here.
              </Link>
            </Typography>

            {this.props.joinGroupErr ?
              <div>
                <Typography variant='h6' style={{paddingTop: '2vh', color: 'red'}}>There was an error joining the group. Check the group name, password and if you've already joined the group.</Typography>
              </div>
              :
              null
              }
          </Container>
        </Box>  
    )
  }
}

const mapStateToProps = state => {
  const { user: {user_info, loggedIn, connectionErr }, group: {joinGroupErr }  } = state;

  return {
    user_info: user_info,
    loggedIn: loggedIn,
    joinGroupErr: joinGroupErr,
    connectionErr: connectionErr
  }
}

const mapDispatchToProps = {
  joinGroupError,
  connectionError
}


const JoinGroupScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(JoinGroup);


export default withStyles(styles)(JoinGroupScreen);