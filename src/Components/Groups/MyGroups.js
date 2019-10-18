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
  Chip,
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
    marginTop: '3vw'
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
    padding: '2vh',
  },
  textInput: {
    margin: '1vh',
    width: '80%'
  },
  button: {
    margin: '2vh'
  },
  icon: {
    margin: 5,
    color: '#b8b8b8',
    cursor: 'pointer',
    position: 'absolute'
  },
  deleteIcon: {
    height: '20px',
    width: '20px',
    cursor: 'pointer'
  },
  drawButton: {
    color: '#4f92ff',  
    borderColor: '#4f92ff', 
    backgroundColor: 'white', 
    margin: '4vh'
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
    height: '50px',
    width: '25vh',
    padding: '0 30px',
    margin: '4vw'
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
    // this.setState({
    //   selectedUserId: this.props.user_info.uidSelected,
    //   selectedUserName: this.props.user_info.selectedUserName
    // }, () => {
    //   console.log('SELECTED USER:', this.state.selectedUserName)
      this.getUserGroups(this.props.user_info._id);
      // this.getSelectedUsersData(this.state.selectedUserId);
    // })
    
  }

  componentDidUpdate(prevProps) {
    if(prevProps.loggedIn !== this.props.loggedIn) {
      this.props.history.push('/profile');
    }
  }
  
  openOptionsMenu = (event) => {
    // console.log('EVENT::', event.currentTarget.getAttribute('groupid'))
    this.setState({
      anchorEl: event.currentTarget,
      groupId: event.currentTarget.getAttribute('groupid')
    })
  }
  
  closeOptionsMenu = () => {
    this.setState({
      anchorEl: null,
      groupId: null
    })
  }

  openDeleteModal = (groupId, memberId) => {
    // console.log('Group:::', groupId)
    // console.log('User:::', memberId)
    // console.log('OPENING DELETE MODAL')
    this.setState({
      deleteUserModal: true,
      deleteUid: memberId,
      groupId: groupId
    })
  };

  closeDeleteModal = () => {
    this.setState({
      deleteUserModal: false,
      deleteUid: null,
      groupId: null
    })
  };
  
  openRemoveModal = (groupId, memberId) => {
    // console.log('Group:::', groupId)
    // console.log('User:::', memberId)
    // console.log('OPENING REMOVE MODAL')
    this.setState({
      removeUserModal: true,
      deleteUid: memberId,
      groupId: groupId
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
      anchorEl: null,
      groupId: null
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
      anchorEl: null,
      groupId: null
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
      component.closeDeleteModal();
      component.closeRemoveModal();
      component.clearSelections(groupId);
      component.getUserGroups(component.props.user_info._id);
    })
    .catch(function (error) {
      // console.log('AXIOS ERROR:', error)
    })
    ;
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
          {this.state.loading ?
            <Container style={{height: '20vh', marginTop: '10vh'}}>
              <CircularProgress style={{color:'#ff476f'}}/>
            </Container>
            :
            <div>
              <Grid 
                container  
                wrap='wrap' 
                direction='row' 
                // alignContent={'center'} 
                // alignItems={'flex-start'} 
                spacing={3}
              >
                {this.state.userGroups.length <= 0 && this.state.loading === false ? 
                  <Container style={{height: '20vh', marginTop: '10vh'}}>
                    <Typography variant='h4'>You haven't joined any groups yet!</Typography>
                    <Typography variant='body1'>When you create or join a group, it will show up here.</Typography>
                  </Container>
                  :
                  this.state.userGroups.map((group, idx) => {
                    let groupName = group.name;
                    const upperCaseGroup = groupName.replace(/^\w/, c => c.toUpperCase());

                    return (
                      <Grid item xs={12} md={6} lg={4} key={group._id}>
                        <Card className={classes.card} style={{minHeight: '30vh'}} key={idx}>
                          <Grid container>
                            <Grid item style={{ flex: 1 }}>
                              <Typography variant='h4' className={classes.title} key={idx}>{upperCaseGroup}</Typography>
                            </Grid>
                            {group.admin === user_info._id ?
                              <Grid item style={{ position:'relative', right: 25, bottom: 10 }}>
                                <SettingsIcon className={classes.icon} groupid={group._id} aria-controls="simple-menu" aria-haspopup="true" onClick={(event) => this.openOptionsMenu(event)} />
                                <Menu
                                  id="simple-menu"
                                  anchorEl={this.state.anchorEl}
                                  keepMounted
                                  transformOrigin={{horizontal: 'right', vertical: -30}}
                                  open={Boolean(this.state.anchorEl)}
                                  onClose={this.closeOptionsMenu}
                                >
                                  <MenuItem onClick={() => this.clearSelections(this.state.groupId)}>Reset Drawing</MenuItem>
                                  <MenuItem className={classes.delete} onClick={() => this.deleteGroup(this.state.groupId)}>Delete Group</MenuItem>
                                </Menu>
                              </Grid>
                              :
                              null
                            }
                          </Grid>

                          {group.memberCount !== 0 ?
                            group.memberCount === 1 ?
                              <Typography variant='body1' key={idx}>{group.memberCount} spot left</Typography>
                              :
                              <Typography variant='body1' key={idx}>{group.memberCount} spots left</Typography>
                          :
                            null
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
                                              <Chip label={member.name.toUpperCase()} style={{backgroundColor: '#4f92ff', color: 'white'}} onDelete={() => this.openDeleteModal(group._id, member.uid)} />
                                            </Grid>
                                            :
                                            <Grid item style={{margin: '1vh'}}>
                                              <Chip label={member.name.toUpperCase()} onDelete={() => this.openDeleteModal(group._id, member.uid)} />
                                            </Grid>
                                          }
                                        </div>
                                        )
                                    }
                                    
                                    //member is current user and current user is NOT the group admin
                                    else if ((member.uid === user_info._id) && (group.admin !== user_info._id)) {
                                      return (
                                        <div key={index}>
                                            <Grid item style={{margin: '1vh'}}>
                                              <Chip label={member.name.toUpperCase()} onDelete={() => this.openRemoveModal(group._id, member.uid)}/>
                                            </Grid>
                                        </div>
                                        )
                                    }
                                    else {
                                      return (
                                        <div key={index}>
                                          {member.selectedBy === this.props.user_info._id ?
                                            <Grid item style={{margin: '1vh'}}>
                                              <Chip style={{backgroundColor: '#4f92ff', color: 'white'}} label={member.name.toUpperCase()}/>
                                            </Grid>
                                            :
                                            <Grid item style={{margin: '1vh'}}>
                                              <Chip label={member.name.toUpperCase()} />
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
                              <Typography variant='body1' className={classes.subText}>Once everyone joins the group, you can draw a name here.</Typography>
                            </div>
                            :
                            null
                            }


                            {group.members.map((member, index) => {

                              if(member.uid === this.props.user_info._id && member.uidSelected === null && group.memberCount === 0) {
                                return (
                                  <div key={index}>
                                    <Button 
                                      variant="outlined"
                                      disabled={false} 
                                      className={classes.drawButton} 
                                      onClick={() => this.drawName(group._id, this.props.user_info._id)}
                                    >
                                      <Typography>
                                        Draw
                                      </Typography>
                                    </Button>
                                  </div>
                                )
                              }
                              
                              else if(member.selectedBy === this.props.user_info._id) {
                                return (
                                  <Container key={index}>
                                    <Typography style={{margin: '4vh'}}>
                                      You drew {' '}
                                        <Link  
                                          to={{
                                            pathname: `/wish-list/${member.uid}`,
                                            state: {
                                              user: member.name
                                            }
                                          }}
                                          style={{textDecoration: 'none'}}> 
                                            <Chip style={{backgroundColor: '#4f92ff', color: 'white', cursor:'pointer'}} label={member.name.toUpperCase()}/>
                                          </Link>
                                      </Typography>
                                      <Typography className={classes.subText}>You can click their name to see their wish list.</Typography>
                                  </Container>
                                )
                              }
                            })}

                        </Card>
                      </Grid>
                    )
                  })}
                </Grid>

                <Container xs={12} m={6} lg={6} className={classes.container}>
                  <Link to="/groups/create-group" style={{ textDecoration: 'none', color: '#fff'}}>
                    <Button  className={classes.link}>
                        <Typography style={{color:'#fff'}}>Create Group</Typography>
                    </Button>
                  </Link>
                  
                  <Link to="/groups/join-group" style={{ textDecoration: 'none', color: '#fff'}}>
                    <Button className={classes.link}>
                        <Typography style={{color:'#fff'}}>Join Group</Typography>
                    </Button>
                  </Link>
                </Container>


                {/* deleting member modal */}
                <Dialog
                    open={this.state.deleteUserModal}
                    onClose={this.closeDeleteModal}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">{"Delete Member?"}</DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        <Typography style={{textAlign: 'center'}}>Are you sure you want to delete this member from the group?</Typography>
                        <Typography style={{textAlign: 'center', fontWeight: 'bold'}}>This will reset the drawing for the entire group.</Typography>
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => this.removeMember(this.state.groupId, this.state.deleteUid)} color="secondary">
                        Delete
                      </Button>
                      <Button onClick={ () => this.closeDeleteModal()} style={{color: '#6b6b6b'}} autoFocus>
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>

                {/* leaving group modal */}
                <Dialog
                  open={this.state.removeUserModal}
                  onClose={this.closeRemoveModal}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">{"Leave Group?"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      <Typography style={{textAlign: 'center'}}> Are you sure you want to leave this group? </Typography>
                      <Typography style={{textAlign: 'center', fontWeight: 'bold'}}>This will reset the drawing for the entire group.</Typography>
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => this.removeMember(this.state.groupId, this.state.deleteUid)} color="secondary">
                      Leave Group
                    </Button>
                    <Button onClick={() => this.closeRemoveModal()} style={{color: '#6b6b6b'}}  autoFocus>
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>
            </div>
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


const GroupsScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(Groups);


export default withStyles(styles)(GroupsScreen);