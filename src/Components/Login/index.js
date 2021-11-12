import React, { Component } from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  setPasswordReset,
  login,
  loginError,
  connectionError,
} from '../../actions/UserActions';
import { withStyles } from '@material-ui/styles';
import {
  Button,
  Container,
  Box,
  Typography,
  TextField,
  CircularProgress,
  Grid,
  Snackbar,
  SnackbarContent,
  IconButton,
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';

const styles = {
  root: {
    background: '#4f92ff',
    margin: 'auto',
    height: '100vh',
    paddingTop: '15vh',
  },
  form: {
    background: '#fff',
    textAlign: 'center',
    paddingBottom: '5vh',
    borderRadius: 5,
  },
  title: {
    paddingTop: '5vh',
  },
  link: {
    margin: '0.5vh',
  },
  linkGroup: {
    display: 'flex',
    flexDirection: 'column',
    margin: '2vh',
  },
  success: {
    backgroundColor: '#00b029',
  },
  textInput: {
    margin: '2vh',
    width: '80%',
    '& label.Mui-focused': {
      color: '#4f92ff',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#4f92ff',
    },
  },
  button: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    width: '25%',
    padding: '0 30px',
    margin: '5vh',
  },
  reset: {
    color: '#00b029',
  },
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  handleSnackBarClose = () => {
    this.props.setPasswordReset(false);
  };

  loginUser = (data) => {
    const component = this;

    // console.log('USER LOGIN DATA:', data)

    axios
      .get('/api/user', {
        params: {
          email: data.email.toLowerCase().trim(),
          password: data.password.trim(),
        },
      })
      .then(function (response) {
        // console.log('AXIOS RESPONSE:', response)
        if (response.data._id) {
          component.props.setPasswordReset(false);
          component.props.login(response.data);
        } else if (!response.data._id) {
          // console.log('LOGIN ERROR RESPONSE:', response)
          component.props.loginError(response.data);
          component.setState({
            loading: false,
          });
        }
      })
      .catch(function (error) {
        component.props.connectionError(error);
        component.setState({
          loading: false,
        });
      });
  };

  render() {
    const { classes, passwordResetStatus } = this.props;

    return (
      <Box className={classes.root}>
        <Grid container justify={'center'}>
          <Grid item xl={6} lg={6} md={6} xs={10}>
            <Container className={classes.form}>
              <Formik
                initialValues={{ email: '', password: '' }}
                validate={(values) => {
                  let errors = {};
                  if (!values.email) {
                    errors.email = 'Required';
                  }
                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                  this.loginUser(values);
                  this.setState({
                    loading: true,
                  });
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
                    <Typography variant="h4" className={classes.title}>
                      Login
                    </Typography>
                    <div>
                      {/* <Typography variant='h5' className={classes.title}>Name</Typography> */}
                      <TextField
                        type="email"
                        name="email"
                        id="standard-required"
                        label="Email"
                        placeholder={'Email'}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        className={classes.textInput}
                      />
                    </div>
                    <div>
                      <Typography style={{ color: 'red' }}>
                        {errors.email}
                      </Typography>
                    </div>

                    <div>
                      {/* <Typography variant='h5' className={classes.title}>Password</Typography> */}
                      <TextField
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
                      <Typography style={{ color: 'red' }}>
                        {errors.password}
                      </Typography>
                    </div>

                    <div>
                      {this.state.loading ? (
                        <Container
                          style={{
                            height: 48,
                            marginBottom: '5vh',
                            marginTop: '5vh',
                          }}
                        >
                          <CircularProgress style={{ color: '#ff476f' }} />
                        </Container>
                      ) : (
                        <Button type="submit" className={classes.button}>
                          Login
                        </Button>
                      )}
                    </div>
                  </form>
                )}
              </Formik>

              <Typography>
                <div className={classes.linkGroup}>
                  <Link
                    to="/register"
                    className={classes.link}
                    style={{ textDecoration: 'none', color: '#4f92ff' }}
                  >
                    Register
                  </Link>
                  <Link
                    to="/reset-link"
                    className={classes.link}
                    style={{ textDecoration: 'none', color: '#4f92ff' }}
                  >
                    Forgot Password?
                  </Link>
                </div>
              </Typography>

              <Snackbar
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                open={passwordResetStatus}
                autoHideDuration={600}
                message="Password reset successful"
                action={
                  <React.Fragment>
                    <Button>Close</Button>
                  </React.Fragment>
                }
              >
                <SnackbarContent
                  className={classes.success}
                  message={<span>Password successfully reset</span>}
                  action={[
                    <IconButton
                      key="close"
                      aria-label="close"
                      color="inherit"
                      onClick={this.handleSnackBarClose}
                    >
                      <CloseIcon className={classes.icon} />
                    </IconButton>,
                  ]}
                />
              </Snackbar>
              {this.props.loginErr ? (
                <div>
                  <Typography
                    variant="h6"
                    style={{ paddingTop: '3vh', color: 'red' }}
                  >
                    {this.props.loginErr}
                  </Typography>
                </div>
              ) : null}
              {this.props.connectionErr ? (
                <div>
                  <Typography
                    variant="h6"
                    style={{ paddingTop: '3vh', color: 'red' }}
                  >
                    ERROR CONNECTING TO DATABASE
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
    user: { user_info, passwordResetStatus, loggedIn, loginErr, connectionErr },
  } = state;

  return {
    user_info: user_info,
    passwordResetStatus: passwordResetStatus,
    loggedIn: loggedIn,
    loginErr: loginErr,
    connectionErr: connectionErr,
  };
};

const mapDispatchToProps = {
  setPasswordReset,
  login,
  loginError,
  connectionError,
};

const LoginScreen = connect(mapStateToProps, mapDispatchToProps)(Login);

export default withStyles(styles)(LoginScreen);
