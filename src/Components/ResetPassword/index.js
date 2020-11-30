import React, { Component } from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { connect } from 'react-redux';
import {
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
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  resetPassword = (data) => {
    const component = this;

    console.log('REGISTER DATA:', data);

    // axios
    //   .post('/api/resetPassword', {
    //     data: {
    //       email: data.email.toLowerCase().trim(),
    //       password: data.password.trim(),
    //     },
    //   })
    //   .then(function (response) {
    //     // console.log('AXIOS RESPONSE:', response)
    //     if (response.data._id) {
    //       component.props.login(response.data);
    //     } else if (!response.data._id) {
    //       component.props.userExistsError();
    //       component.setState({
    //         loading: false,
    //       });
    //     }
    //   })
    //   .catch(function (error) {
    //     // console.log('AXIOS ERROR:', error)
    //     component.props.connectionError(error);
    //     component.setState({
    //       loading: false,
    //     });
    //   });
  };

  render() {
    const { classes } = this.props;
    return (
      <Box className={classes.root}>
        <Grid container justify={'center'}>
          <Grid item xl={6} lg={6} md={6} xs={10}>
            <Container className={classes.form}>
              <Formik
                initialValues={{ email: '', password: '', confirmPassword: '' }}
                validate={(values) => {
                  let errors = {};
                  if (!values.name) {
                    errors.name = 'Required';
                  }
                  if (values.password !== values.confirmPassword) {
                    errors.confirmPassword = 'Passwords do not match';
                  }
                  return errors;
                }}
                onSubmit={(values) => {
                  console.log('RESET VALUES', values);
                  //   this.resetPassword(values);
                  this.setState({
                    loading: true,
                  });
                }}
              >
                {({
                  values,
                  errors,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <Typography variant="h4" className={classes.title}>
                      Reset Password
                    </Typography>

                    <div>
                      {/* <Typography variant='h5' className={classes.title}>Name</Typography> */}
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
                    {/* <div>
                            <Typography style={{color: 'red'}}>{errors.name}</Typography>
                          </div> */}

                    <div>
                      {/* <Typography variant='h5' className={classes.title}>Password</Typography> */}
                      <TextField
                        required
                        type="password"
                        name="password"
                        id="standard-password-input-1"
                        label="New Password"
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
                      {/* <Typography variant='h5' className={classes.title}>Confirm Password</Typography> */}
                      <TextField
                        required
                        type="password"
                        name="confirmPassword"
                        id="standard-password-input-2"
                        label="Confirm Password"
                        placeholder={'Confirm Password'}
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
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className={classes.button}
                        >
                          Reset Password
                        </Button>
                      )}
                    </div>
                  </form>
                )}
              </Formik>
              {/* 
              {this.props.userExistsErr ? (
                <div>
                  <Typography
                    variant="h6"
                    style={{ paddingTop: '4vh', color: 'red' }}
                  >
                    USER ALREADY EXISTS
                  </Typography>
                </div>
              ) : null}
              {this.props.connectionErr ? (
                <div>
                  <Typography
                    variant="h6"
                    style={{ paddingTop: '4vh', color: 'red' }}
                  >
                    ERROR CONNECTING TO DATABASE
                  </Typography>
                </div>
              ) : null} */}
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
  login,
  userExistsError,
  connectionError,
};

const ResetPasswordScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetPassword);

export default withStyles(styles)(ResetPasswordScreen);
