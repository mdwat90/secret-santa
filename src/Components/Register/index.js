import React, {Component} from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { connect } from 'react-redux';
import { login, userExistsError, connectionError} from '../../actions/UserActions';

class Register extends Component {
  constructor(props) {
    super(props)
    // this.state={
    //   registered: false,
    //   loggedIn: this.props.loggedIn,
    //   registrationError: false,
    //   connectionError: false
    // }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.loggedIn !== this.props.loggedIn) {
      this.props.history.push('/groups/my-groups')
    }
  }

  registerUser = (data) => {
    const component = this;

    console.log('REGISTER DATA:', data)

    axios.post('http://localhost:3001/api/newUser', {
      data : {
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
        component.props.userExistsError();
      }
    })
    .catch(function (error) {
      // console.log('AXIOS ERROR:', error)
      component.props.connectionError(error);
    })
  }

  render() {
    return (
      this.props.loggedIn ?
          <div>
            <h3>You've already registered!</h3>
            <p>Click "Profile" to see your profile, or "Groups" to see your groups.</p>
          </div>
        :
          <div>
          <Formik
            initialValues={{ name: '', password: '', confirmPassword: ''}}
            validate={values => {
              let errors = {};
              if (!values.name) {
                errors.name = 'Required';
              } 
              if (values.password !== values.confirmPassword) {
                errors.confirmPassword = 'Passwords do not match';
              } 
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              this.registerUser(values);
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
                <h1>Confirm Password</h1>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder={'Password'}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.confirmPassword}
                />
              </div>
              <div>
                  {errors.confirmPassword}
              </div>
                <div>
                  <button type="submit" disabled={isSubmitting}>
                    Submit
                  </button>
                </div>
              </form>
            )}
          </Formik>
          
          {/* {this.props.history.action === "REPLACE" ?
              <div>
                <h2>PLEASE SIGN IN</h2>
              </div>
              :
              null
          } */}
          {this.props.userExistsErr ?
              <div>
                <h3>USER ALREADY EXISTS</h3>
              </div>
              :
              null
          }
          {this.props.connectionErr ?
          <div>
            <h3>ERROR CONNECTING TO DATABASE</h3>
          </div>
          :
          null
      }
          </div>
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


const RegisterScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(Register);


export default RegisterScreen;