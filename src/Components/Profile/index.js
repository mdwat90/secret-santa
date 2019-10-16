// /client/App.js
import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

class Profile extends Component {
  // initialize our state
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      user_id: null,
      description: null,
      link: null,
      notes: null,
      updateToApply: null,
      itemToUpdate: null
    }
  }

  componentDidMount() {
    console.log('PROFILE PROPS:', this.props)

    // this.setState({
    //   user_id: this.props.user_info._id,
    //   selectedUserId: this.props.user_info.uidSelected,
    //   selectedUserName: this.props.user_info.selectedUserName
    // }, () => {
    //   console.log('SELECTED USER:', this.state.selectedUserName)
    //   this.getUserData(this.state.user_id);
    //   this.getSelectedUsersData(this.state.selectedUserId);
    // })
  }
 
  // componentDidUpdate(prevProps) {
  //   if(this.props !== prevProps) {
  //     console.log('PROFILE NEW PROPS:', this.props)
  //   }
  // }


  getUserData= (userId) => {
    axios.get('http://localhost:3001/api/getItems', {
      params: {
        user_id: userId
      }
    })
      .then((res) => this.setState({ data: res.data }))
  };
  

  addNewItem = (description, link, notes) => {
    let component = this;
    console.log('Description:', description)
    console.log('LINK:', link)
    console.log('Notes:', notes)
    // axios.post('http://localhost:3001/api/newItem', {
    //   user_id: this.props.user_info._id,
    //   description: description,
    //   link: link,
    //   notes: notes
    // })
    // .then(function (response) {
    //   // console.log('AXIOS RESPONSE:', response)
    //   component.getUserData(component.props.user_info._id);
    // })
    // .catch(function (error) {
    //   console.log('AXIOS ERROR:', error)
    // });
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
      component.getUserData(component.props.user_info._id);
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
      component.getUserData(component.props.user_info._id);
    })
    .catch(function (error) {
      console.log('AXIOS ERROR:', error)
    })
  };


  render() {
    const { data } = this.state;
    return (
      <div className="container">
        <ul>
          {data.length <= 0
            ? 'NO DB ENTRIES YET'
            : data.map((dat) => (
                <li style={{ padding: '10px' }} key={dat._id}>
                  <span style={{ color: 'gray' }}> link: </span>
                    {this.state.itemToUpdate === dat._id ? 
                      <div key={data._id}>
                        <input
                          type="text"
                          style={{ width: '200px' }}
                          onChange={(e) => this.setState({ updateToApply: e.target.value })}
                          placeholder={this.state.updateToApply}
                          value={this.state.updateToApply}
                        />
                        <div>
                          <button 
                            onClick={() => 
                              this.deleteFromDB(dat._id)
                            }>
                            DELETE ITEM
                          </button>
                          <button 
                            onClick={() => {
                            this.updateDB(dat._id, this.state.updateToApply);
                            this.setState({
                              itemToUpdate: null, 
                              updateToApply: null
                              })
                              }
                            }>
                              APPLY UPDATE
                            </button>
                        </div>
                      </div>
                    :
                     <div>
                     <a href={dat.link} target='_blank'>{dat.link}</a>
                        <div>
                          <button onClick={() => this.deleteFromDB(dat._id)}>DELETE ITEM</button>
                          <button onClick={() => this.setState({itemToUpdate: dat._id, updateToApply: dat.link})}>UPDATE ITEM</button>
                        </div>
                     </div>
                    }
                </li>
              ))}
        </ul>


        <div style={{ padding: '10px' }}>
          <input
            type="text"
            onChange={(e) => this.setState({ description: e.target.value })}
            placeholder="item description"
            style={{ width: '200px' }}
          />
          <input
            type="text"
            onChange={(e) => this.setState({ link: e.target.value })}
            placeholder="link to item"
            style={{ width: '200px' }}
          />
          <input
            type="text"
            onChange={(e) => this.setState({ notes: e.target.value })}
            placeholder="add any notes about this item"
            style={{ width: '200px' }}
          />
          <button onClick={() => this.addNewItem(this.state.description, this.state.link, this.state.notes )}>
            ADD
          </button>
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



const ProfileScreen = connect(
  mapStateToProps,
  null
)(Profile);


export default ProfileScreen;