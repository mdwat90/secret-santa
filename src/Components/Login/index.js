import React, {Component} from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { login, loginError, connectionError} from '../../actions/UserActions';
import { withStyles } from '@material-ui/styles';
import { Button, Container, Box, Typography, TextField, CircularProgress } from '@material-ui/core';


const styles = {
  root: {
    background: '#4f92ff',
    margin: 'auto',
    height: '100vh',
    paddingTop: '15vh'
  },
  form: {
    background: '#fff',
    textAlign: 'center',
    width: '50%',
    height: '60vh',
    borderRadius: 5
  },
  title: {
    paddingTop: '5vh',
  },
  link: {
    margin: '2vh',
  },
  textInput: {
    margin: '2vh',
    width: '80%'
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
    margin: '5vh'
  },
};

class Login extends Component {
  constructor(props) {
    super(props)
    this.state={
      loading: false
    }
  }

  loginUser = (data) => {
    const component = this;

    axios.get('http://localhost:3001/api/user', {
      params: {
        name: data.name.toLowerCase().trim(),
        password: data.password.trim()
      }
    })
    .then(function (response) {
      // console.log('AXIOS RESPONSE:', response)
      if(response.data._id){
        component.props.login(response.data)
      }
      else if(!response.data._id){
        component.props.loginError();
        component.setState({
          loading: false
        })
      }
    })
    .catch(function (error) {
      component.props.connectionError(error);
      component.setState({
        loading: false
      })
    })
  }

  render() {
    // console.log('HOME PROPS:', this.props)
    const { classes } = this.props;
    return (
      <Box className={classes.root}>
        <Container className={classes.form} >
          <Formik
            initialValues={{ name: '', password: '' }}
            validate={values => {
              let errors = {};
              if (!values.name) {
                errors.name = 'Required';
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              this.loginUser(values);
              this.setState({
                loading: true
              })
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
                  <Typography variant='h4' className={classes.title}>Login</Typography>
                <div>
                  {/* <Typography variant='h5' className={classes.title}>Name</Typography> */}
                  <TextField
                    type="name"
                    name="name"
                    id="standard-required"
                    label="First Name"
                    placeholder={'First Name'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    className={classes.textInput}
                  />
                </div>
                <div>
                    <Typography style={{color: 'red'}}>{errors.name}</Typography>
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
                  <Typography style={{color: 'red'}}>{errors.password}</Typography>
                </div>
                
                <div>
                  {this.state.loading ? 
                    <Container style={{height: 48, marginBottom: '5vh', marginTop: '5vh'}}>
                      <CircularProgress />
                    </Container>
                    :
                    <Button type="submit" className={classes.button}>
                      Login
                    </Button>
                  }
                </div>
              </form>
            )}
          </Formik>

          
          <Typography>
            <Link to="/register" className={classes.link} style={{ textDecoration: 'none', color: '#4f92ff' }}>Register Here</Link>
          </Typography>
      
          {/* {this.props.history.action === "REPLACE" 
          ?
              <div>
                <h2>PLEASE SIGN IN</h2>
              </div>
              :
              null
          } */}
          {this.props.loginErr ?
              <div>
              <Typography variant='h6' style={{paddingTop: '3vh', color: 'red'}}>ERROR LOGGING IN</Typography>
              </div>
              :
              null
          }
          {this.props.connectionErr ?
              <div>
              <Typography variant='h6' style={{paddingTop: '3vh', color: 'red'}}>ERROR CONNECTING TO DATABASE</Typography>
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
  const { user: {user_info, loggedIn, loginErr, connectionErr } } = state;

  return {
    user_info: user_info,
    loggedIn: loggedIn,
    loginErr: loginErr,
    connectionErr: connectionErr
  }
}

const mapDispatchToProps = {
  login,
  loginError,
  connectionError
}



const LoginScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);


export default withStyles(styles)(LoginScreen);