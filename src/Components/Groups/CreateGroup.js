import React, { Component } from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { connect } from 'react-redux';
import { connectionError } from '../../actions/UserActions';
import {
  groupExistsError,
  createGroupSuccess,
  joinGroupSuccess,
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
  Switch,
  FormLabel,
} from '@material-ui/core';

const styles = {
  root: {
    background: '#fff',
    margin: 'auto',
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
    margin: '4vh',
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

class CreateGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupCreated: false,
      nameDrawing: true,
    };
  }

  componentDidUpdate(prevProps) {
    window.scrollTo(0, 0);
    if (prevProps.loggedIn !== this.props.loggedIn) {
      this.props.history.push('/profile');
    }
  }

  handleSwitch = () => {
    this.setState(
      {
        nameDrawing: !this.state.nameDrawing,
      },
      () => {
        console.log('NAME DRAWING:', this.state.nameDrawing);
      }
    );
  };

  createGroup = (data) => {
    const component = this;

    console.log('CLIENT GROUP DATA:', data);

    axios
      .post('/api/newGroup', {
        data: {
          admin: data.admin,
          adminName: data.adminName,
          adminEmail: data.adminEmail.toLowerCase().trim(),
          confirmPassword: data.confirmPassword,
          nameDrawing: data.nameDrawing,
          memberCount: data.memberCount,
          name: data.name.toLowerCase().trim(),
          password: data.password.trim(),
        },
      })
      .then(function (response) {
        // console.log('AXIOS RESPONSE:', response)
        if (response.data._id) {
          component.props.createGroupSuccess();
          component.props.joinGroupSuccess();
          component.setState({
            groupCreated: !component.state.groupCreated,
          });
          setTimeout(function () {
            component.props.history.push('/groups/my-groups');
          }, 1500);
        } else if (!response.data._id) {
          component.props.groupExistsError();
        }
      })
      .catch(function (error) {
        // console.log('AXIOS ERROR:', error)
        component.props.connectionError(error);
      });
  };

  render() {
    const { user_info, classes } = this.props;

    return this.state.groupCreated ? (
      <Container style={{ marginTop: '5vh' }}>
        <Typography variant="h5">Your group has been created!</Typography>
      </Container>
    ) : (
      <Box className={classes.root}>
        <Grid container justify={'center'}>
          <Grid item xl={6} lg={7} md={10} xs={12}>
            <Container className={classes.form}>
              <Formik
                initialValues={{
                  admin: user_info._id,
                  adminName: user_info.name,
                  adminEmail: user_info.email,
                  name: '',
                  password: '',
                  nameDrawing: false,
                  confirmPassword: '',
                  memberCount: '',
                }}
                validate={(values) => {
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
                  isSubmitting,
                }) => (
                  <form onSubmit={handleSubmit}>
                    {errors.admin}
                    <Typography variant="h5" className={classes.title}>
                      New Group
                    </Typography>
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
                        label="Confirm Password"
                        placeholder={'Password'}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.confirmPassword}
                        className={classes.textInput}
                      />
                    </div>
                    <div>
                      <Typography style={{ color: 'red' }}>
                        {errors.confirmPassword}
                      </Typography>
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

                    <div style={{ marginTop: '5vh' }}>
                      <FormLabel>Enable Name Drawing</FormLabel>
                    </div>

                    <Grid
                      component="label"
                      container
                      style={{
                        justifyContent: 'center',
                      }}
                      alignItems="center"
                      spacing={1}
                    >
                      <Grid
                        item
                        component="label"
                        container
                        style={{
                          width: 150,
                          justifyContent: 'center',
                        }}
                        alignItems="center"
                        spacing={1}
                      >
                        <Typography>
                          <Grid item>Off</Grid>
                        </Typography>
                        <Grid item>
                          <Switch
                            checked={values.nameDrawing}
                            name="nameDrawing"
                            label="Enable Name Drawing"
                            onChange={handleChange}
                            value={values.nameDrawing}
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                          />
                        </Grid>
                        <Typography>
                          <Grid item>On</Grid>
                        </Typography>
                      </Grid>
                    </Grid>

                    <div>
                      <Button type="submit" className={classes.button}>
                        Create Group
                      </Button>
                    </div>
                  </form>
                )}
              </Formik>

              <Typography style={{ marginTop: '2vh', marginBottom: '4vh' }}>
                <Link
                  to="/groups/join-group"
                  style={{ textDecoration: 'none', color: '#4f92ff' }}
                >
                  Join Existing Group
                </Link>
              </Typography>

              {this.props.groupExistsErr ? (
                <div>
                  <Typography
                    style={{
                      paddingTop: '2vh',
                      color: 'red',
                      fontWeight: 'bold',
                    }}
                  >
                    There's already a group with that name. Try changing the
                    name of the group.
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
    group: { groupExistsErr },
  } = state;

  return {
    user_info: user_info,
    loggedIn: loggedIn,
    groupExistsErr: groupExistsErr,
    connectionErr: connectionErr,
  };
};

const mapDispatchToProps = {
  groupExistsError,
  connectionError,
  createGroupSuccess,
  joinGroupSuccess,
};

const CreateGroupScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateGroup);

export default withStyles(styles)(CreateGroupScreen);
