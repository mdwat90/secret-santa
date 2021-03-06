import React, { Component } from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { connect } from 'react-redux';
import { connectionError } from '../../actions/UserActions';
import {
  joinGroupError,
  joinGroupSuccess,
  createGroupSuccess,
} from '../../actions/GroupActions';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { withStyles } from '@material-ui/styles';
import {
  Button,
  Container,
  Box,
  Typography,
  TextField,
  Grid,
} from '@material-ui/core';

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
    borderRadius: 5,
  },
  title: {
    paddingTop: '5vh',
  },
  link: {
    margin: '2vh',
  },
  textInput: {
    margin: '1vh',
    width: '80%',
    '& label.Mui-focused': {
      color: '#4f92ff',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#4f92ff',
    },
    // '& .MuiOutlinedInput-root': {
    //   '& fieldset': {
    //     borderColor: 'red',
    //   },
    //   '&:hover fieldset': {
    //     borderColor: 'yellow',
    //   },
    //   '&.Mui-focused fieldset': {
    //     borderColor: 'green',
    //   },
    // }
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
    margin: '5vh',
    marginTop: '7vh',
  },
};

class JoinGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupJoined: false,
    };
  }

  componentDidUpdate(prevProps) {
    window.scrollTo(0, 0);
    if (prevProps.loggedIn !== this.props.loggedIn) {
      this.props.history.push('/profile');
    }
  }

  JoinGroup = (data) => {
    const component = this;

    // console.log('CLIENT GROUP DATA:', data)

    axios
      .post('/api/joinGroup', {
        data: {
          uid: data.uid,
          name: data.name.toLowerCase().trim(),
          email: data.email.toLowerCase().trim(),
          group: data.group.toLowerCase().trim(),
          password: data.password.trim(),
        },
      })
      .then(function (response) {
        // console.log('AXIOS RESPONSE:', response)
        if (response.data._id) {
          component.props.joinGroupSuccess();
          component.props.createGroupSuccess();
          component.setState({
            groupJoined: !component.state.groupJoined,
          });
          setTimeout(function () {
            component.props.history.push('/groups/my-groups');
          }, 1500);
        } else if (!response.data._id) {
          // console.log('JOIN GROUP ERROR', response)
          component.props.joinGroupError(response.data);
        }
      })
      .catch(function (error) {
        // console.log('AXIOS ERROR:', error)
        component.props.connectionError(error);
      });
  };

  render() {
    const { user_info, classes } = this.props;

    return this.state.groupJoined ? (
      <Container style={{ marginTop: '5vh' }}>
        <Typography variant="h5">You have joined the group!</Typography>
      </Container>
    ) : (
      <Box className={classes.root}>
        <Grid container justify={'center'}>
          <Grid item xl={6} lg={7} md={10} xs={12}>
            <Container className={classes.form}>
              <Formik
                initialValues={{
                  uid: user_info._id,
                  name: user_info.name,
                  email: user_info.email,
                  group: '',
                  password: '',
                }}
                validate={(values) => {
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
                  isSubmitting,
                }) => (
                  <form onSubmit={handleSubmit}>
                    {errors.admin}
                    <Typography variant="h5" className={classes.title}>
                      Join Group
                    </Typography>
                    {/* <div>
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
                      </div> */}

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

              <Typography className={classes.link}>
                <Link
                  to="/groups/create-group"
                  style={{ textDecoration: 'none', color: '#4f92ff' }}
                >
                  Create Group
                </Link>
              </Typography>

              {this.props.joinGroupErr ? (
                <div>
                  <Typography
                    style={{
                      paddingTop: '2vh',
                      color: 'red',
                      fontWeight: 'bold',
                    }}
                  >
                    {this.props.joinGroupErr}
                  </Typography>
                </div>
              ) : null}
            </Container>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    user: { user_info, loggedIn, connectionErr },
    group: { joinGroupErr },
  } = state;

  return {
    user_info: user_info,
    loggedIn: loggedIn,
    joinGroupErr: joinGroupErr,
    connectionErr: connectionErr,
  };
};

const mapDispatchToProps = {
  joinGroupError,
  connectionError,
  joinGroupSuccess,
  createGroupSuccess,
};

const JoinGroupScreen = connect(mapStateToProps, mapDispatchToProps)(JoinGroup);

export default withStyles(styles)(JoinGroupScreen);
