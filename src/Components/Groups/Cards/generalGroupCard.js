import React, {Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { login, userExistsError, connectionError} from '../../../actions/UserActions';
import { withStyles } from '@material-ui/core/styles';
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

class GeneralCard extends Component {

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
          resetDrawingModal: false,
          deleteGroupModal: false,
          nameDrawing: false,
          groupId: null,
          deleteUid: null,
          loading: null
        }
      }

      openOptionsMenu = (event) => {
        console.log('GROUP ID::', event.currentTarget.getAttribute('groupid'))
        this.setState({
          anchorEl: event.currentTarget,
          groupId: event.currentTarget.getAttribute('groupid')
        })
      }
      
      closeOptionsMenu = () => {
        this.setState({
          anchorEl: null,
          groupId: null
        }, () => {
          console.log('GROUP ID:', this.state.groupId)
        })
      }
    
      openDeleteModal = (groupId, memberId, nameDrawing) => {
        console.log('NAME DRAWING:', nameDrawing)
        // console.log('Group:::', groupId)
        // console.log('User:::', memberId)
        // console.log('OPENING DELETE MODAL')
        this.setState({
          deleteUserModal: true,
          nameDrawing: nameDrawing,
          deleteUid: memberId,
          groupId: groupId
        })
      };
    
      closeDeleteModal = () => {
        this.setState({
          deleteUserModal: false,
          nameDrawing: null,
          deleteUid: null,
          groupId: null
        })
      };
      
      openRemoveModal = (groupId, memberId, nameDrawing) => {
        console.log('NAME DRAWING:', nameDrawing)
        // console.log('Group:::', groupId)
        // console.log('User:::', memberId)
        // console.log('OPENING REMOVE MODAL')
        this.setState({
          removeUserModal: true,
          nameDrawing: nameDrawing,
          deleteUid: memberId,
          groupId: groupId
        })
      };
    
      closeRemoveModal = () => {
        this.setState({
          removeUserModal: false,
          nameDrawing: null,
          deleteUid: null,
          groupId: null
        })
      };
      
      openDeleteGroupModal = (groupId) => {
        // console.log('Group:::', groupId)
        // console.log('User:::', memberId)
        // console.log('OPENING REMOVE MODAL')
        this.setState({
          deleteGroupModal: true,
          groupId: groupId
        })
      };
    
      closeDeleteGroupModal = () => {
        this.setState({
          deleteGroupModal: false,
          groupId: null
        })
      };
    

      deleteGroup = (idTodelete) => {
        let component = this;
    
        this.setState({
          anchorEl: null,
          groupId: null
        })
    
        // console.log('ID OF GROUP>', idTodelete)
        axios.delete('/api/deleteGroup', {
          data: {
            _id: idTodelete,
          },
        })
        .then(function (response) {
          // console.log('AXIOS RESPONSE:', response)
          component.closeDeleteGroupModal();
          component.props.getUserGroups(component.props.user_info._id);
        })
        .catch(function (error) {
          // console.log('AXIOS ERROR:', error)
        })
        ;
      };

    
      removeMember = (groupId, userId) => {
        let component = this;
    
        axios.delete('/api/removeMember', {
          data: {
            group_id: groupId,
            uid: userId,
          },
        })
        .then(function (response) {
          console.log('AXIOS RESPONSE:', response)
          component.closeDeleteModal();
          component.closeRemoveModal();
          component.clearSelections(groupId, true);
          component.props.getUserGroups(component.props.user_info._id);
        })
        .catch(function (error) {
          // console.log('AXIOS ERROR:', error)
        })
        ;
      };


    render() {
    
        const { group, user_info, idx, classes } = this.props;
    
        let groupName = group.name;
        const upperCaseGroup = groupName.replace(/^\w/, c => c.toUpperCase());
    
        return (
            <div>
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
                            <MenuItem onClick={() => this.openDeleteGroupModal(this.state.groupId)} className={classes.delete}>Delete Group</MenuItem>
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
                            justify='flex-start'
                        >
                            {group.members.map((member, index) => {

                            //member is NOT current user and current user is the group admin
                            if (group.admin === user_info._id && member.uid !== user_info._id) {
                                return (
                                <div key={index}>
                                    <Grid item style={{margin: '0.3em' }}>
                                        <Chip style={{backgroundColor: '#4f92ff', color: 'white', cursor:'pointer'}} onClick={() => this.props.routeChange(member.uid, member.name)} label={member.name.toUpperCase()}  onDelete={() => this.openDeleteModal(group._id, member.uid, group.nameDrawing)}/>
                                    </Grid>
                                </div>
                                )
                            }
                            if (group.admin !== user_info._id && member.uid === user_info._id) {
                                return (
                                <div key={index}>
                                    <Grid item style={{margin: '0.3em' }}>
                                        <Chip label={member.name.toUpperCase()}  onDelete={() => this.openRemoveModal(group._id, member.uid,  group.nameDrawing)}/>
                                    </Grid>
                                </div>
                                )
                            }
                            else if (member.uid !== user_info._id) {
                                return (
                                <div key={index}>
                                    <Grid item style={{margin: '0.3em' }}>
                                        <Chip style={{backgroundColor: '#4f92ff', color: 'white', cursor:'pointer'}} onClick={() => this.props.routeChange(member.uid, member.name)} label={member.name.toUpperCase()}/>
                                    </Grid>
                                </div>
                                )
                            }
                            else {
                                return (
                                <div key={index}>
                                    <Grid item style={{margin: '0.3em' }}>
                                        <Chip label={member.name.toUpperCase()}/>
                                    </Grid>
                                </div>
                                )
                            }
                            
                            })}
                        </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>


                    <div>
                    <Typography className={classes.subText}>You can click a member's name to see their wishlist.</Typography>
                    </div>
                </Card>

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
                
                {/* reset drawing modal */}
                <Dialog
                  open={this.state.resetDrawingModal}
                  onClose={this.closeResetDrawingModal}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">{"Reset Drawing?"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      <Typography style={{textAlign: 'center'}}> Are you sure you want to reset the drawing for this group? </Typography>
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => this.clearSelections(this.state.groupId, false)} color="secondary">
                      Reset
                    </Button>
                    <Button onClick={() => this.closeResetDrawingModal()} style={{color: '#6b6b6b'}}  autoFocus>
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>
                
                {/* delete group modal */}
                <Dialog
                  open={this.state.deleteGroupModal}
                  onClose={this.closeDeleteGroupModal}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">{"Delete Group?"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      <Typography style={{textAlign: 'center'}}> Are you sure you want to delete this group? </Typography>
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => this.deleteGroup(this.state.groupId)} color="secondary">
                      Delete Group
                    </Button>
                    <Button onClick={() => this.closeDeleteGroupModal()} style={{color: '#6b6b6b'}}  autoFocus>
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>
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
  
  
  const GeneralGroupCard = connect(
    mapStateToProps,
    mapDispatchToProps
  )(GeneralCard);

export default withStyles(styles)(GeneralGroupCard);