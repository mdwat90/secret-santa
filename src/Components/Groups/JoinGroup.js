import React, {Component} from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { connect } from 'react-redux';
import { connectionError } from '../../actions/UserActions';
import { joinGroupError } from '../../actions/GroupActions';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

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
        })
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
    const {user_info} = this.props;

    return (
      this.state.groupJoined ? 
        <div>
          <h3>You have joined the group!</h3>
        </div>
        :
        <div>
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
              <div>
                <h3>Your Name</h3>
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
                <h3>Group Name</h3>
                <input
                  type="name"
                  name="group"
                  placeholder={'Group Name'}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.group}
                />
              </div>
              <div>
                  {errors.group}
              </div>
              <div>
                <h3>Password</h3>
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

          {this.props.joinGroupErr ?
          <div>
            <h3>There was an error joining the group. Check the group name, password and if you've already joined the group.</h3>
          </div>
          :
          null
          }
          </div>
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


export default JoinGroupScreen;