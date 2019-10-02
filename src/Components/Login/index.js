import React, {Component} from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { connect } from 'react-redux';
import { login, loginError, connectionError} from '../../actions/UserActions';

class Login extends Component {
  constructor(props) {
    super(props)
    // this.state={
    //   loggedIn: false,
    //   loginError: false,
    //   connectionError: false
    // }
  }

  // componentDidMount() {
  //   console.log('LOGIN PROPS:', this.props)
  // }

  // componentDidUpdate(prevProps) {
  //   if(prevProps !== this.props) {
  //     console.log('NEW LOGIN PROPS:', this.props)
  //   }
  // }

  loginUser = (data) => {
    const component = this;

    axios.get('http://localhost:3001/api/user', {
      params: {
        name: data.name,
        password: data.password
      }
    })
    .then(function (response) {
      // console.log('AXIOS RESPONSE:', response)
      if(response.data._id){
        component.props.login(response.data)
      }
      else if(!response.data._id){
        component.props.loginError();
      }
    })
    .catch(function (error) {
      component.props.connectionError(error);
    })
  }

  render() {
    // console.log('HOME PROPS:', this.props)
    return (
      <div>
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
          // this.props.login(values);
          this.loginUser(values);
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
          <div>
            <h1>Name</h1>
            <input
              type="name"
              name="name"
              placeholder={'First Name'}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
            />
          </div>
          <div>
              {errors.name}
          </div>
          <div>
            <h1>Password</h1>
            <input
              type="password"
              name="password"
              placeholder={'Password'}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />
          </div>
          <div>
              {errors.password}
          </div>
            <div>
              <button type="submit">
                Submit
              </button>
            </div>
          </form>
        )}
      </Formik>
      
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
            <h2>ERROR LOGGING IN</h2>
          </div>
          :
          null
      }
      {this.props.connectionErr ?
          <div>
            <h2>ERROR CONNECTING TO DATABASE</h2>
          </div>
          :
          null
      }
      </div>
  
      
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


export default LoginScreen;