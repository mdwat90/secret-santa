// /client/App.js
import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { logOut } from '../../actions/UserActions';

class Profile extends Component {
  // initialize our state
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      user_id: null,
      link: null,
      idToDelete: null,
      idToUpdate: null,
      updateToApply: null
    }
  }

  componentDidMount() {
    console.log('PROFILE PROPS:', this.props)

    this.setState({
      user_id: this.props.user_info._id
    }, () => {
      console.log('PROFILE USER ID:', this.state.user_id)
      this.getDataFromDb(this.state.user_id);
    })
  }
 
  // componentDidUpdate(prevProps) {
  //   if(this.props !== prevProps) {
  //     console.log('PROFILE NEW PROPS:', this.props)
  //   }
  // }


  componentWillUnmount() {
    // if (this.state.intervalIsSet) {
    //   clearInterval(this.state.intervalIsSet);
    //   this.setState({ intervalIsSet: null });
    // }
  }

  getDataFromDb = () => {
    axios.get('http://localhost:3001/api/getItems', {
      params: {
        user_id: this.state.user_id
      }
    })
      .then((res) => this.setState({ data: res.data }))
  };

  addNewItem = (link) => {
    let component = this;
    console.log('LINK:', link)
    axios.post('http://localhost:3001/api/newItem', {
      user_id: this.state.user_id,
      link: link
    })
    .then(function (response) {
      // console.log('AXIOS RESPONSE:', response)
      component.getDataFromDb(component.state.user_id);
    })
    .catch(function (error) {
      console.log('AXIOS ERROR:', error)
    })
    ;
  };


  deleteFromDB = (idTodelete) => {
    let component = this;
    axios.delete('http://localhost:3001/api/deleteItem', {
      data: {
        _id: idTodelete,
      },
    })
    .then(function (response) {
      // console.log('AXIOS RESPONSE:', response)
      component.getDataFromDb(component.state.user_id);
    })
    .catch(function (error) {
      console.log('AXIOS ERROR:', error)
    })
    ;
  };

  updateDB = (idToUpdate, updateToApply) => {
    let component = this;
    axios.post('http://localhost:3001/api/updateItem', {
      _id: idToUpdate,
      update: { link: updateToApply },
    })
    .then(function (response) {
      // console.log('AXIOS RESPONSE:', response)
      component.getDataFromDb(component.state.user_id);
    })
    .catch(function (error) {
      console.log('AXIOS ERROR:', error)
    })
  };

  logout = () => {
    this.props.logOut();
  }

  render() {
    const { data } = this.state;
    return (
      <div>
        <ul>
          {data.length <= 0
            ? 'NO DB ENTRIES YET'
            : data.map((dat) => (
                <li style={{ padding: '10px' }} key={data._id}>
                  <span style={{ color: 'gray' }}> id: </span> {dat._id} <br />
                  <span style={{ color: 'gray' }}> link: </span>
                  {dat.link}
                </li>
              ))}
        </ul>


        <div style={{ padding: '10px' }}>
          <input
            type="text"
            onChange={(e) => this.setState({ link: e.target.value })}
            placeholder="add something in the database"
            style={{ width: '200px' }}
          />
          <button onClick={() => this.addNewItem(this.state.link)}>
            ADD
          </button>
        </div>

        <div style={{ padding: '10px' }}>
          <input
            type="text"
            style={{ width: '200px' }}
            onChange={(e) => this.setState({ idToDelete: e.target.value })}
            placeholder="put id of item to delete here"
          />
          <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
            DELETE
          </button>
        </div>

        <div style={{ padding: '10px' }}>
          <input
            type="text"
            style={{ width: '200px' }}
            onChange={(e) => this.setState({ idToUpdate: e.target.value }, () => console.log(this.state.idToUpdate))}
            placeholder="id of item to update here"
          />
          <input
            type="text"
            style={{ width: '200px' }}
            onChange={(e) => this.setState({ updateToApply: e.target.value })}
            placeholder="put new value of the item here"
          />
          <button
            onClick={() =>
              this.updateDB(this.state.idToUpdate, this.state.updateToApply)
            }
          >
            UPDATE
          </button>
        </div>

        <div>
          <h2>Draw Name</h2>
        </div>
        
        <div>
          <button onClick={this.logout}>Logout</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { user: {user_info, loggedIn} } = state;

  return {
    user_info: user_info, 
    loggedIn: loggedIn
  }
}

const mapDispatchToProps = {
  logOut
}



const ProfileScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);


export default ProfileScreen;