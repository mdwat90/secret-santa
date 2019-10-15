import React, {Component} from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { connect } from 'react-redux';
import { login, userExistsError, connectionError} from '../../actions/UserActions';
import { withStyles } from '@material-ui/styles';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { 
  Button, 
  Container, 
  CircularProgress,
  Box, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle,
  Typography, 
  TextField, 
  Card, 
  Grid, 
  Menu, 
  MenuItem, 
  ExpansionPanel, 
  ExpansionPanelSummary, 
  ExpansionPanelDetails } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

const styles = {
  root: {
    background: '#4f92ff',
    margin: 'auto',
    height: '100vh',
    paddingTop: '15vh'
  },
  container: {
    background: '#fff',
    textAlign: 'center',
    width: '75%',
    marginTop: '5vh'
  },
  form: {
    background: '#fff',
    textAlign: 'center',
    width: '50%',
    height: '80%',
    borderRadius: 5
  },
  title: {
    margin: '1vh',
  },
  subText: {
    margin: '2vh',
    color: '#b8b8b8'
  },
  card: {
    padding: '2vh'
  },
  textInput: {
    margin: '1vh',
    width: '80%'
  },
  button: {
    margin: '2vh'
  },
  icon: {
    margin: 5
  },
  deleteIcon: {
    height: '20px',
    width: '20px',
    cursor: 'pointer'
  },
  delete: {
    color: 'red'
  },
  panel: {
    marginTop: '2vh',
    borderWidth: '0px',
    boxShadow: '0 0 0 0',
    // background: 'red'
  },
  link: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    display: 'inline-flex',
    height: '8vh',
    width: '25vh',
    padding: '0 30px',
    margin: '5vh'
  },
};

class Groups extends Component {
  constructor(props) {
    super(props)
    this.state={
      userGroups: [],
      selectedUsersData: [],
      selectedUserId: null,
      selectedUserName: null,
      selectUserErr: false,
      registrationError: false,
      connectionError: false,
      anchorEl: null,
      deleteUserModal: false,
      removeUserModal: false,
      groupId: null,
      deleteUid: null,
      loading: null
    }
  }


  componentDidMount() {
    this.setState({
      selectedUserId: this.props.user_info.uidSelected,
      selectedUserName: this.props.user_info.selectedUserName
    }, () => {
      console.log('SELECTED USER:', this.state.selectedUserName)
      this.getUserGroups(this.props.user_info._id);
      this.getSelectedUsersData(this.state.selectedUserId);
    })
    
  }

  componentDidUpdate(prevProps) {
    if(prevProps.loggedIn !== this.props.loggedIn) {
      this.props.history.push('/profile');
    }
  }
  
  openOptionsMenu = (event) => {
    this.setState({
      anchorEl: event.currentTarget
    })
  }
  
  closeOptionsMenu = () => {
    this.setState({
      anchorEl: null
    })
  }

  openDeleteModal = (event) => {
    // console.log('USER:::', event.currentTarget.getAttribute('id'))
    // console.log('GROUP:::', event.currentTarget.getAttribute('groupId'))
    this.setState({
      deleteUserModal: true,
      deleteUid: event.currentTarget.getAttribute('id'),
      groupId: event.currentTarget.getAttribute('groupId')
    })
  };

  closeDeleteModal = () => {
    this.setState({
      deleteUserModal: false,
      deleteUid: null,
      groupId: null
    })
  };
  
  openRemoveModal = (event) => {
    // console.log('USER:::', event.currentTarget.getAttribute('id'))
    // console.log('GROUP:::', event.currentTarget.getAttribute('groupId'))
    this.setState({
      removeUserModal: true,
      deleteUid: event.currentTarget.getAttribute('id'),
      groupId: event.currentTarget.getAttribute('groupId')
    })
  };

  closeRemoveModal = () => {
    this.setState({
      removeUserModal: false,
      deleteUid: null,
      groupId: null
    })
  };


  getUserGroups = (userId) => {
    this.setState({
      loading: true
    }, () => {
      console.log('LOADING:', this.state.loading)
    })

    axios.get('http://localhost:3001/api/getUserGroups', {
      params: {
        user_id: userId
      }
    })
      .then((res) => {
        this.setState({ userGroups: res.data, loading: false }, () => {
          console.log('USERS GROUPS:', this.state.userGroups)
          console.log('LOADING:', this.state.loading)
        })
    })
    .catch(error => {
      console.log('AXIOS GET USER GROUPS ERROR', error)
    })
  };

  getSelectedUsersData = (id) => {
    axios.get('http://localhost:3001/api/getSelectedUsersItems', {
      params: {
        user_id: id
      }
    })
      .then((res) => this.setState({ selectedUsersData: res.data }, () => {console.log('SELECTED USERS DATA:', this.state.selectedUsersData)}))
  };


  deleteGroup = (idTodelete) => {
    let component = this;

    this.setState({
      anchorEl: null
    })

    // console.log('ID OF GROUP>', idTodelete)
    axios.delete('http://localhost:3001/api/deleteGroup', {
      data: {
        _id: idTodelete,
      },
    })
    .then(function (response) {
      // console.log('AXIOS RESPONSE:', response)
      component.getUserGroups(component.props.user_info._id);
    })
    .catch(function (error) {
      // console.log('AXIOS ERROR:', error)
    })
    ;
  };
  
  clearSelections = (groupId) => {
    let component = this;

    this.setState({
      anchorEl: null
    })

    // console.log('ID OF GROUP>', idTodelete)
    axios.post('http://localhost:3001/api/clearSelections', {
      data: {
        group_id: groupId,
      },
    })
    .then(function (response) {
      // console.log('AXIOS RESPONSE:', response)
      component.getUserGroups(component.props.user_info._id);
    })
    .catch(function (error) {
      // console.log('AXIOS ERROR:', error)
    })
    ;
  };

  removeMember = (groupId, userId) => {
    let component = this;

    axios.delete('http://localhost:3001/api/removeMember', {
      data: {
        group_id: groupId,
        uid: userId,
      },
    })
    .then(function (response) {
      // console.log('AXIOS RESPONSE:', response)
      component.getUserGroups(component.props.user_info._id);
    })
    .catch(function (error) {
      // console.log('AXIOS ERROR:', error)
    })
    ;

    this.closeDeleteModal();
  };

  drawName = (groupId, userId) => {
    let component = this;

    console.log('GROUP ID:', groupId)
    console.log('USER ID:', userId)
    axios.post('http://localhost:3001/api/selectUser', {
      group_id: groupId,
      user_id: userId
    })
    .then(function (response) {
      // console.log('DRAW NAME AXIOS RESPONSE:', response)
       if (response.data === '') {
          console.log('SELECT USER ERROR!!')
      }
      else {
        console.log('USER SELECTED:', response)
        component.getUserGroups(component.props.user_info._id);
        // component.getSelectedUsersData(response.data._id);
      }
        
    })
    .catch(function (error) {
      console.log('DRAW NAME AXIOS ERROR:', error)
    })
  } 

  render() {
    const { user_info, classes } = this.props;

    return (
        <div>
          <Grid 
            container  
            wrap='wrap' 
            direction='row' 
            alignContent={'flex-start'} 
            alignItems={'flex-start'} 
            spacing={3}
          >
            {this.state.loading ?
              <Container style={{height: '20vh', marginTop: '10vh'}}>
                <CircularProgress />
              </Container>
              :
              null
             }

            {this.state.userGroups.length <= 0 && this.state.loading === false ? 
              <Container style={{height: '20vh', marginTop: '10vh'}}>
                <Typography variant='h4'>You haven't joined any groups yet!</Typography>
                <Typography variant='body1'>When you create or join a group, it will show up here.</Typography>
              </Container>
              :
              this.state.userGroups.map((group, idx) => {
              return (
                <Grid item xs={12} md={6} lg={4}>
                  <Card className={classes.card} key={idx}>
                    <Grid container>
                      <Grid item style={{ flex: 1 }}>
                        <Typography variant='h4' className={classes.title} key={idx}>{group.name}</Typography>
                      </Grid>
                      {group.admin === user_info._id ?
                        <Grid item>
                          <SettingsIcon className={classes.icon} aria-controls="simple-menu" aria-haspopup="true" onClick={this.openOptionsMenu} />
                          <Menu
                            id="simple-menu"
                            anchorEl={this.state.anchorEl}
                            keepMounted
                            open={Boolean(this.state.anchorEl)}
                            onClose={this.closeOptionsMenu}
                          >
                            <MenuItem onClick={() => this.clearSelections(group._id)}>Clear Selections</MenuItem>
                            <MenuItem className={classes.delete} onClick={() => this.deleteGroup(group._id)}>Delete Group</MenuItem>
                          </Menu>
                        </Grid>
                        :
                        null
                      }
                    </Grid>

                    {group.memberCount !== 0 ?
                      <Typography variant='body1' key={idx}>{group.memberCount} spots left.</Typography>
                    :
                      <Typography variant='body1' key={idx}>Ready!</Typography>
                    }

                    <ExpansionPanel className={classes.panel}>
                      <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography variant='h6'>Members</Typography>
                      </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                          <Grid 
                            container  
                            wrap='wrap' 
                            direction='row' 
                            alignContent={'flex-start'} 
                            alignItems={'flex-start'} 
                            spacing={3}
                          >
                            {group.members.map((member, index) => {

                              //member is NOT current user and current user is the group admin
                              if ((member.uid !== user_info._id) && (group.admin === user_info._id)) {
                                return (
                                  <div key={index}>
                                    {member.selectedBy === this.props.user_info._id ?
                                      <Grid item style={{margin: '1vh'}}>
                                        <Grid container direction='row' spacing={1}>
                                          <Grid item>
                                            <Typography variant='body2' style={{color: '#4f92ff'}} key={index}>{member.name.toUpperCase()}</Typography>
                                          </Grid>
                                          <Grid item>
                                            <HighlightOffIcon className={classes.deleteIcon} id={member.uid} groupId={group._id} onClick={(event) => this.openDeleteModal(event)} />
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                      :
                                      <Grid item style={{margin: '1vh'}}>
                                        <Grid container direction='row' spacing={1}>
                                          <Grid item>
                                            <Typography variant='body2' key={index}>{member.name.toUpperCase()}</Typography>
                                          </Grid>
                                          <Grid item>
                                            <HighlightOffIcon className={classes.deleteIcon} id={member.uid} groupId={group._id} onClick={(event) => this.openDeleteModal(event)} />
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                    }
                                    
                                    {/* deleting member */}
                                    <Dialog
                                      open={this.state.deleteUserModal}
                                      onClose={this.closeDeleteModal}
                                      aria-labelledby="alert-dialog-title"
                                      aria-describedby="alert-dialog-description"
                                    >
                                      <DialogTitle id="alert-dialog-title">{"Delete Member?"}</DialogTitle>
                                      <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                          Are you sure you want to delete this member from the group?
                                        </DialogContentText>
                                      </DialogContent>
                                      <DialogActions>
                                        <Button onClick={() => this.removeMember(this.state.groupId, this.state.deleteUid)} color="secondary">
                                          Delete
                                        </Button>
                                        <Button onClick={ () => this.closeDeleteModal()} color="primary" autoFocus>
                                          Close
                                        </Button>
                                      </DialogActions>
                                    </Dialog>
                                  </div>
                                  )
                              }
                              
                              //member is current user and current user is NOT the group admin
                              else if ((member.uid === user_info._id) && (group.admin !== user_info._id)) {
                                return (
                                  <div key={index}>
                                    {member.selectedBy === this.props.user_info._id ?
                                      <Grid item style={{margin: '1vh'}}>
                                        <Grid container direction='row' spacing={1}>
                                          <Grid item>
                                            <Typography variant='body2' style={{color: '#4f92ff'}} key={index}>{member.name.toUpperCase()}</Typography>
                                          </Grid>
                                          <Grid item>
                                            <HighlightOffIcon className={classes.deleteIcon} id={member.uid} groupId={group._id}   onClick={(event) => this.openRemoveModal(event)} />
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                      :
                                      <Grid item style={{margin: '1vh'}}>
                                        <Grid container direction='row' spacing={1}>
                                          <Grid item>
                                            <Typography variant='body2' key={index}>{member.name.toUpperCase()}</Typography>
                                          </Grid>
                                          <Grid item>
                                            <HighlightOffIcon className={classes.deleteIcon} id={member.uid} groupId={group._id}  onClick={(event) => this.openRemoveModal(event)} />
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                    }

                                    {/* leaving group */}
                                    <Dialog
                                      open={this.state.removeUserModal}
                                      onClose={this.closeDeleteModal}
                                      aria-labelledby="alert-dialog-title"
                                      aria-describedby="alert-dialog-description"
                                    >
                                      <DialogTitle id="alert-dialog-title">{"Leave Group?"}</DialogTitle>
                                      <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                          Are you sure you want to leave this group?
                                        </DialogContentText>
                                      </DialogContent>
                                      <DialogActions>
                                        <Button onClick={() => this.removeMember(this.state.groupId, this.state.deleteUid)} color="secondary">
                                          Leave Group
                                        </Button>
                                        <Button onClick={() => this.closeRemoveModal()} color="primary" autoFocus>
                                          Close
                                        </Button>
                                      </DialogActions>
                                    </Dialog>
                                  </div>
                                  )
                              }
                              else {
                                return (
                                  <div key={index}>
                                    {member.selectedBy === this.props.user_info._id ?
                                      <Grid item style={{margin: '1vh'}}>
                                        <Grid container direction='row' spacing={1}>
                                          <Grid item>
                                            <Typography variant='body2' style={{color: '#4f92ff'}} key={index}>{member.name.toUpperCase()}</Typography>
                                          </Grid>
                                          {/* <Grid item>
                                            <HighlightOffIcon className={classes.deleteIcon} id={member.uid}  onClick={(event) => this.openDeleteModal(event)} />
                                          </Grid> */}
                                        </Grid>
                                      </Grid>
                                      :
                                      <Grid item style={{margin: '1vh'}}>
                                        <Grid container direction='row' spacing={1}>
                                          <Grid item>
                                            <Typography variant='body2' key={index}>{member.name.toUpperCase()}</Typography>
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                    }
                                  </div>
                                  )
                              }
                            })}
                          </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>


                    {group.memberCount !== 0 ?
                      <div>
                        <Typography variant='body1' className={classes.subText}>When everyone joins the group, you can draw a name below.</Typography>
                        <div>
                          {/* <Typography variant='h5' className={classes.title}>Draw Name</Typography> */}
                            <Button color='primary' 
                              disabled={true} 
                              className={classes.button} 
                              onClick={() => this.drawName(group._id, this.props.user_info._id)}
                            >
                              Draw
                            </Button>
                        </div>
                      </div>
                      :
                      null
                      }


                      {group.members.map((member, index) => {
                        if(member.selectedBy === this.props.user_info._id) {
                          return (
                            <Typography style={{color: '#4f92ff'}}>You selected {member.name.toUpperCase()}</Typography>
                          )
                        }

                        if(member.uid === this.props.user_info._id && member.uidSelected === null && group.memberCount === 0) {
                          return (
                            <div>
                              <Button color='primary' 
                                disabled={false} 
                                className={classes.button} 
                                onClick={() => this.drawName(group._id, this.props.user_info._id)}
                              >
                                Draw
                              </Button>
                            </div>
                          )
                        }
                      })}

                  </Card>
                </Grid>
              )
            })}
            </Grid>

            <Container className={classes.container}>
              <Link to="/groups/create-group" style={{ textDecoration: 'none', color: '#fff'}}>
                <Button className={classes.link}>
                    <Typography style={{color:'#fff'}}>Create Group</Typography>
                </Button>
              </Link>
              
              <Link to="/groups/join-group" style={{ textDecoration: 'none', color: '#fff'}}>
                <Button className={classes.link}>
                    <Typography style={{color:'#fff'}}>Join Group</Typography>
                </Button>
              </Link>
            </Container>
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


const GroupsScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(Groups);


export default withStyles(styles)(GroupsScreen);