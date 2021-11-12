import React, { Component } from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { connect } from 'react-redux';
import {
  setPasswordReset,
  login,
  userExistsError,
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
} from '@material-ui/core';

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
  },
  button: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    width: '30%',
    padding: '0 30px',
    margin: '5vh',
  },
};

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      resetLinkSent: false,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  sendResetLink = (data) => {
    const component = this;

    axios
      .get('/api/resetLink', {
        data: {
          email: data.email.toLowerCase().trim(),
        },
      })
      .then(function (response) {
        console.log('AXIOS RESPONSE:', response);

        // if (response.data._id) {
        //   component.setState({
        //     loading: false,
        //     resetLinkSent: true,
        //   });
        // } else if (!response.data._id) {
        //   component.props.userExistsError();
        //   component.setState({
        //     loading: false,
        //   });
        // }
      })
      .catch(function (error) {
        // console.log('AXIOS ERROR:', error)
        component.props.connectionError(error);
        component.setState({
          loading: false,
        });
      });
  };

  // resetPassword = (data) => {
  //   const component = this;

  //   axios
  //     .post('/api/resetPassword', {
  //       email: data.email.toLowerCase().trim(),
  //       newPassword: data.password.trim(),
  //     })
  //     .then(function (response) {
  //       // console.log('AXIOS RESPONSE:', response);
  //       if (response.data._id) {
  //         component.props.setPasswordReset(true);
  //         component.props.history.push('/');
  //       } else if (!response.data._id) {
  //         component.props.userExistsError();
  //         component.setState({
  //           loading: false,
  //         });
  //       }
  //     })
  //     .catch(function (error) {
  //       // console.log('AXIOS ERROR:', error)
  //       component.props.connectionError(error);
  //       component.setState({
  //         loading: false,
  //       });
  //     });
  // };

  render() {
    const { classes } = this.props;
    const { resetLinkSent } = this.state;
    return (
      <Box className={classes.root}>
        <Grid container justify={'center'}>
          <Grid item xl={6} lg={6} md={6} xs={10}>
            <Container className={classes.form}>
              <Formik
                initialValues={{ email: '' }}
                validate={(values) => {
                  let errors = {};
                  if (!values.email) {
                    errors.email = 'Required';
                  }
                  return errors;
                }}
                onSubmit={(values) => {
                  this.sendResetLink(values);
                  this.setState({
                    loading: true,
                  });
                }}
              >
                {({ values, handleChange, handleBlur, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <Typography variant="h4" className={classes.title}>
                      Reset Password
                    </Typography>

                    {resetLinkSent ? (
                      <div>
                        <Typography variant="p" className={classes.title}>
                          Your password reset link has been sent to your email
                        </Typography>
                      </div>
                    ) : (
                      <div>
                        <div>
                          <Typography variant="body2" className={classes.title}>
                            Enter your email and we will send you a reset
                            password link.
                          </Typography>
                          <TextField
                            required
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
                            <Button
                              type="submit"
                              // disabled={isSubmitting}
                              className={classes.button}
                            >
                              Send Link
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </form>
                )}
              </Formik>
            </Container>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    user: { user_info, loggedIn, userExistsErr, connectionErr },
  } = state;

  return {
    user_info: user_info,
    loggedIn: loggedIn,
    userExistsErr: userExistsErr,
    connectionErr: connectionErr,
  };
};

const mapDispatchToProps = {
  setPasswordReset,
  login,
  userExistsError,
  connectionError,
};

const ResetPasswordScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetPassword);

export default withStyles(styles)(ResetPasswordScreen);
