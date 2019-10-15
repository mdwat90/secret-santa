import React, {Component} from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { connect } from 'react-redux';
import { connectionError} from '../../actions/UserActions';
import { groupExistsError } from '../../actions/GroupActions';
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

class CreateGroup extends Component {
  constructor(props) {
    super(props)
    this.state={
      groupCreated: false
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.loggedIn !== this.props.loggedIn) {
      this.props.history.push('/profile')
    }
  }

  createGroup = (data) => {
    const component = this;

    console.log('CLIENT GROUP DATA:', data)

    axios.post('http://localhost:3001/api/newGroup', {
      data : {
        admin: data.admin,
        adminName: data.adminName,
        confirmPassword: data.confirmPassword,
        memberCount: data.memberCount,
        name: data.name.trim(),
        password: data.password.trim()
      }
    })
    .then(function (response) {
      console.log('AXIOS RESPONSE:', response)
      if(response.data._id){
        component.setState({
          groupCreated: !component.state.groupCreated
        })
      }
      else if(!response.data._id){
        component.props.groupExistsError();
      }
    })
    .catch(function (error) {
      console.log('AXIOS ERROR:', error)
      // component.props.connectionError(error);
    })
  }


  render() {
    const {user_info, classes} = this.props;

    return (
      this.state.groupCreated ? 
        <div>
          <Typography variant='h3'>Your group has been created!</Typography>
        </div>
        :
        <Box className={classes.root}>
          <Container className={classes.form}>
            <Formik
              initialValues={{ admin: user_info._id, adminName: user_info.name, name: '', password: '', confirmPassword: '', memberCount: '' }}
              validate={values => {
                let errors = {};
                if (!values.name) {
                  errors.name = 'Required';
                } 
                if (!values.memberCount) {
                  errors.memberCount = 'Required';
                } 
                if (values.password !== values.confirmPassword) {
                  errors.confirmPassword = 'Passwords do not match';
                } 
                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                this.createGroup(values);
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
                  <Typography variant='h5' className={classes.title}>New Group</Typography>
                  <div>
                    {/* <Typography variant='h5' className={classes.title}>Group Name</Typography> */}
                    <TextField
                      required
                      type="name"
                      name="name"
                      id="standard-required"
                      label="Group Name"
                      placeholder={'Group Name'}
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
                    {/* <Typography variant='h5' className={classes.title}>Confirm Password</Typography> */}
                    <TextField
                      required
                      type="password"
                      name="confirmPassword"
                      id="standard-password-input"
                      label="Password"
                      placeholder={'Password'}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.confirmPassword}
                      className={classes.textInput}
                    />
                  </div>
                  <div>
                    <Typography style={{color: 'red'}}>{errors.confirmPassword}</Typography>
                  </div>

                  <div>
                    {/* <Typography variant='h5' className={classes.title}>Number of Members</Typography> */}
                    <TextField
                      required
                      type="number"
                      name="memberCount"
                      id="standard-number"
                      label="Number of Members"
                      placeholder={'Number'}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.memberCount}
                      className={classes.textInput}
                    />
                  </div>
                  <div>
                    {/* <Typography style={{color: 'red'}}>{errors.memberCount}</Typography> */}
                  </div>
                  <div>
                    <Button type="submit" disabled={isSubmitting} className={classes.button}>
                      Create Group
                    </Button>
                  </div>
                </form>
              )}
            </Formik>


            <Typography>
              <Link to="/groups/join-group" className={classes.link} style={{ textDecoration: 'none', color: '#4f92ff' }}>
                You can join a group that's already been created by clicking here.
              </Link>
            </Typography>


            {this.props.groupExistsErr ?
              <div>
                <Typography variant='h6' style={{paddingTop: '2vh', color: 'red'}}>There's already a group with that name. Try changing the name of the group.</Typography>
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
  const { user: {user_info, loggedIn, connectionErr }, group: {groupExistsErr } } = state;

  return {
    user_info: user_info,
    loggedIn: loggedIn,
    groupExistsErr: groupExistsErr,
    connectionErr: connectionErr
  }
}

const mapDispatchToProps = {
  groupExistsError,
  connectionError
}


const CreateGroupScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateGroup);


export default withStyles(styles)(CreateGroupScreen);