import React, {Component} from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { connect } from 'react-redux';
import { connectionError} from '../../actions/UserActions';
import { groupExistsError } from '../../actions/GroupActions';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

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
      data
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
    const {user_info} = this.props;

    return (
      this.state.groupCreated ? 
        <div>
          <h3>Your group has been created!</h3>
        </div>
        :
        <div>
          <Formik
            initialValues={{ admin: user_info._id, adminName: user_info.name, name: '', password: '', confirmPassword: '', memberCount: '' }}
            validate={values => {
              let errors = {};
              if (!values.name) {
                errors.name = 'Required';
              } 
              if (!values.password) {
                errors.name = 'Required';
              } 
              if (!values.confirmPassword) {
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
              <div>
                <h3>Group Name</h3>
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
                <h3>Confirm Password</h3>
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
                <h3>Number of Members</h3>
                <input
                  type="number"
                  name="memberCount"
                  placeholder={'Number'}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.memberCount}
                />
              </div>
              <div>
                  {errors.memberCount}
              </div>
                <div>
                  <button type="submit" disabled={isSubmitting}>
                    Submit
                  </button>
                </div>
              </form>
            )}
          </Formik>


          {this.props.groupExistsErr ?
          <div>
            <h3>There's already a group with that name. Try changing the name of the group.</h3>
          </div>
          :
          null
          }
          </div>
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


export default CreateGroupScreen;