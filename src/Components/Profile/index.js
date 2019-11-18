// /client/App.js
import React, { Component } from 'react';
import axios from 'axios';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import { 
  Button, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Container, 
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Box, 
  Link,
  Grid,
  Typography, 
  TextField, 
  CircularProgress
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';


const styles = {
  root: {
    background: '#fff',
    margin: 'auto',
    height: '100vh'
  },
  container: {
    background: '#fff',
    textAlign: 'center',
    width: '100%',
    marginTop: '5vh',
    paddingBottom: '10vh'
  },
  form: {
    background: '#fff',
    textAlign: 'center',
    width: '50%',
    height: '65vh',
    borderRadius: 5
  },
  title: {
    paddingTop: '5vh',
  },
  link: {
    marginTop: '5vh',
    color: '#4f92ff',
    textDecoration: 'underline'
  },
  noLink: {
    marginTop: '5vh',
    color: '#6b6b6b'
  },
  textInput: {
    '& label.Mui': {
      color: '#4f92ff',
    },
    '& label.Mui-focused': {
      color: '#4f92ff',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#4f92ff',
    },
    // '& .MuiOutlinedInput-root': {
    //   '& fieldset': {
    //     borderColor: 'red',
    //   },
    //   '&:hover fieldset': {
    //     borderColor: 'yellow',
    //   },
    //   '&.Mui-focused fieldset': {
    //     borderColor: 'green',
    //   },
    // }
  },
  heading: {
    // fontSize: '3vh'
  },
  details: {
    backgroundColor: '#d1d1d1'
  },
  icon: {
    marginRight: '1vw',
    fontSize: '20px',
    color: '#8f8f8f'
  },
  button: {
    borderColor: '#4f92ff', 
    color: '#4f92ff'
  },
  cancelButton: {
    color: '#6b6b6b'
  }
};

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
      itemToUpdate: null,
      updateItemForm: false,
      addItemForm: false,
      formError: false,
      panel: null,
      panelOpen: false,
      linkError: false,
      loading: false,
      deleteItemModal: false,
      itemToDelete: null
    }
  }

  componentDidMount() {
    // console.log('PROFILE PROPS:', this.props)
    window.scrollTo(0, 0);

    this.setState({
      user_id: this.props.user_info._id
    }, () => {
      this.getUserData(this.state.user_id);
      // this.getSelectedUsersData(this.state.selectedUserId);
    })
  }
 
  // componentDidUpdate(prevProps) {
  //   if(this.props !== prevProps) {
  //     console.log('PROFILE NEW PROPS:', this.props)
  //   }
  // }

  openAddForm = () => {
    this.setState({
      addItemForm: true
    })
  }
  
  closeAddForm = () => {
    this.setState({
      addItemForm: false
    })
  }
  
  editForm = (event, item) => {
    event.stopPropagation();
    // console.log('ITEM TO UPDATE:', item)
    this.setState({
      itemToUpdate: item._id,
      description: item.description,
      link: item.link,
      notes: item.notes,
      updateItemForm: true
    })
  }
  
  
  closeEditForm = () => {
    this.setState({
      updateItemForm: false
    })
  }

  openDeleteModal = (event, item) => {
    event.stopPropagation();
    console.log('ITEM TO DELETE:', item)
    this.setState({
      deleteItemModal: true,
      itemToDelete: item
    })
  }
  
  
  closeDeleteModal = () => {
    this.setState({
      deleteItemModal: false
    })
  }

  expandPanel = (panel) => {
    this.setState({
      panel: panel,
      panelOpen: !this.state.panelOpen
    })
  }
  
  preventDefault = event => event.preventDefault();


  getUserData= (userId) => {
    this.setState({
      loading: true
    })

    axios.get('/api/getItems', {
      params: {
        user_id: userId
      }
    })
      .then((res) => this.setState({ data: res.data, loading: false }))
  };


  addNewItem = (description, link, notes) => {
    let component = this;

    if(link) {
      var validateLink = link.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
      if(validateLink === null) {
        // console.log('NOT A VALID LINK')
        component.setState({
          linkError: true
        })
      }
      else {
        // console.log('GOOD TO GO')
        component.closeAddForm();
  
        component.setState({
          linkError: false
        })
        axios.post('/api/newItem', {
          user_id: this.props.user_info._id,
          description: description,
          link: link,
          notes: notes
        })
        .then(function (response) {
          // console.log('AXIOS RESPONSE:', response)
          component.setState({
            description: null,
            link: null,
            notes: null
          })
          component.getUserData(component.props.user_info._id);
        })
        .catch(function (error) {
          // console.log('AXIOS ERROR:', error)
        });
      }
    }
    else {
      component.closeAddForm();

      component.setState({
          linkError: false
        })
        axios.post('/api/newItem', {
          user_id: this.props.user_info._id,
          description: description,
          link: link,
          notes: notes
        })
        .then(function (response) {
          // console.log('AXIOS RESPONSE:', response)
          component.setState({
            description: null,
            link: null,
            notes: null
          })
          component.getUserData(component.props.user_info._id);
        })
        .catch(function (error) {
          // console.log('AXIOS ERROR:', error)
        });
    }
  };


  deleteFromDB = (idTodelete) => {
    let component = this;
    axios.delete('/api/deleteItem', {
      data: {
        _id: idTodelete,
        user_id: this.props.user_info._id,
      },
    })
    .then(function (response) {
      // console.log('AXIOS RESPONSE:', response)
      component.setState({
        itemToDelete: null,
        deleteItemModal: false
      });
      component.getUserData(component.props.user_info._id);
    })
    .catch(function (error) {
      // console.log('AXIOS ERROR:', error)
    })
    ;
  };

  updateDB = (idToUpdate, description, link, notes) => {
    let component = this;

    // console.log('UPDATE ITEM:', idToUpdate)
    // console.log('Description UPDATE:', description)
    // console.log('LINK UPDATE:', link)
    // console.log('NOTES UPDATE:', notes)

    if(link) {
      var validateLink = link.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
      if(validateLink === null) {
        // console.log('NOT A VALID LINK')
        this.setState({
          linkError: true
        })
      }
      else {
        // console.log('GOOD TO GO')
        component.closeEditForm();
  
        component.setState({
          linkError: false
        })
        axios.post('/api/updateItem', {
          _id: idToUpdate,
          user_id: this.props.user_info._id,
          update: { description: description, link: link, notes: notes},
        })
        .then(function (response) {
          // console.log('AXIOS RESPONSE:', response)
          component.setState({
            description: null,
            link: null,
            notes: null
          })
          component.getUserData(component.props.user_info._id);
        })
        .catch(function (error) {
          // console.log('AXIOS ERROR:', error)
        });
      }
    }
    else {
      // console.log('GOOD TO GO')
      component.closeEditForm();

      axios.post('/api/updateItem', {
        _id: idToUpdate,
        user_id: this.props.user_info._id,
        update: { description: description, link: link, notes: notes},
      })
      .then(function (response) {
        // console.log('AXIOS RESPONSE:', response)
        component.setState({
          description: null,
          link: null,
          notes: null
        })
        component.getUserData(component.props.user_info._id);
      })
      .catch(function (error) {
        // console.log('AXIOS ERROR:', error)
      })
    }
    
  };


  render() {
    const { data } = this.state;
    const { classes } = this.props;
    return (
      <div>
        {this.state.loading ?
          <Box>
            <Container className={classes.container} style={{marginTop: '10vh'}}>
              <CircularProgress style={{color:'#ff476f'}} />
            </Container>
          </Box>
          :
          <Box className={classes.root}>
            <Container container justify='center' className={classes.container}>
              {data.length <= 0 ? 
                <Container style={{height: '10vh', marginTop: '10vh'}}>
                  <Typography variant='h5'>You haven't added any items to your wishlist</Typography>
                </Container>
                : 
                data.map((item, index) => (
                  <Grid  justify='center' container>
                   <Grid item md={8} sm={12} xs={12}>
                    <div key={item._id}>
                        <ExpansionPanel 
                          style={this.state.panel === item._id && this.state.panelOpen ? {marginBottom: '4vh'} : {marginBottom: '2vh'}} 
                          expanded={this.state.panel === item._id && this.state.panelOpen} 
                          onChange={item.notes ? () => this.expandPanel(item._id) : null}>
                          <ExpansionPanelSummary
                            expandIcon={item.notes ? <ExpandMoreIcon /> : <ExpandMoreIcon style={{color: '#fff'}} /> }
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                          >
                            <Grid container justify={'flex-start'}>
                              <Typography className={classes.heading}>
                                {item.link ?
                                  <Link href= {item.link} onClick={() => this.preventDefault} target={'_blank'} className={classes.link}>
                                    {item.description}
                                  </Link>
                                  :
                                  <Typography className={classes.noLink} style={{display: 'inline'}}>{item.description}</Typography>
                                }
                              </Typography>
                            </Grid>
                            <Grid container justify={'flex-end'} direction={'row'} style={{width: 80 }}>
                              <Grid container justify={'flex-end'} direction={'row'} alignItems='center'>
                                  <Grid item>
                                    <DeleteIcon onClick={(event) =>this.openDeleteModal(event, item)} className={classes.icon}/>
                                  </Grid>
                                  <Grid item>
                                    <EditIcon onClick={(event) => this.editForm(event, item)} className={classes.icon}/>
                                  </Grid>
                              </Grid>
                            </Grid>
                          </ExpansionPanelSummary>
                          {item.notes ? 
                            <ExpansionPanelDetails className={classes.details}>
                              <Typography style={{wordBreak: 'break-word', overflowWrap: 'break-word','whiteSpace': 'pre-line', textAlign: 'left' }}>
                                {item.notes}
                              </Typography>
                            </ExpansionPanelDetails>
                            :
                            null
                          }
                        </ExpansionPanel>
                      </div>
                   </Grid>
                  </Grid>
                ))
              }

                <Container style={{marginTop: '5vh', marginBottom: '5vh'}}>
                  <Button variant="outlined" className={classes.button} onClick={this.openAddForm}>
                    <Typography className={classes.buttonText}>
                      Add Item
                    </Typography>
                  </Button>
                </Container>
            </Container>


            {/* Update Item Modal */}
            <Dialog open={this.state.updateItemForm} onClose={this.closeEditForm} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Update Item</DialogTitle>
              <DialogContent>
                {/* <DialogContentText>
                  Add item details below
                </DialogContentText> */}
                <TextField
                  required
                  id="standard-required"
                  label={"Item description"}
                  value={this.state.description}
                  autoFocus
                  margin="dense"
                  fullWidth
                  className={classes.textInput}
                  onChange={(e) => this.setState({ description: e.target.value })}
                />
                <TextField
                  // required
                  error={this.state.linkError ? true : false}
                  id="standard-error"
                  margin="dense"
                  label={this.state.linkError ? "Must be a valid link": "Item link"}
                  type="name"
                  fullWidth
                  className={this.state.link && this.state.linkError ? null : classes.textInput}
                  value={this.state.link}
                  onChange={(e) => this.setState({ link: e.target.value })}
                />
                <TextField
                  multiline={true}
                  margin="dense"
                  label="Notes (sizes, colors, etc.)"
                  type="name"
                  fullWidth
                  className={classes.textInput}
                  value={this.state.notes}
                  onChange={(e) => this.setState({ notes: e.target.value })}
                />
              </DialogContent>
              <DialogActions>
                <Button className={classes.cancelButton} onClick={() => this.closeEditForm()}>
                  <Typography>
                    Cancel
                  </Typography>
                </Button>
                <Button 
                  className={classes.button}
                  disabled={!this.state.description} 
                  onClick={() => this.updateDB(this.state.itemToUpdate, this.state.description, this.state.link, this.state.notes)} 
                  >
                    <Typography>Update Item</Typography>
                </Button>
              </DialogActions>
            </Dialog>


            {/* Add Item Modal */}
            <Dialog open={this.state.addItemForm} onClose={this.closeAddForm} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Add Item</DialogTitle>
              <DialogContent>
                {/* <DialogContentText>
                  Add item details below
                </DialogContentText> */}
                <TextField
                  required
                  id="standard-required"
                  label="Item description"
                  autoFocus
                  margin="dense"
                  fullWidth
                  className={classes.textInput}
                  onChange={(e) => this.setState({ description: e.target.value })}
                />
                <TextField
                  // required
                  error={this.state.linkError ? true : false}
                  id="standard-error"
                  margin="dense"
                  label={this.state.link && this.state.linkError ? "Must be a valid link": "Item link"}
                  type="name"
                  fullWidth
                  className={this.state.linkError ? null : classes.textInput}
                  onChange={(e) => this.setState({ link: e.target.value })}
                />
                <TextField
                  multiline={true}
                  margin="dense"
                  label="Notes (sizes, colors, etc.)"
                  type="name"
                  fullWidth
                  className={classes.textInput}
                  onChange={(e) => this.setState({ notes: e.target.value })}
                />
              </DialogContent>
              <DialogActions>
                <Button className={classes.cancelButton} onClick={() => this.closeAddForm()}>
                  <Typography>
                    Cancel
                  </Typography>
                </Button>
                <Button 
                  className={classes.button}
                  disabled={!this.state.description} 
                  onClick={() => this.addNewItem(this.state.description, this.state.link, this.state.notes )} 
                  >
                    <Typography>Add Item</Typography>
                </Button>
              </DialogActions>
            </Dialog>
            
            {/* Delete Item Modal */}
            <Dialog open={this.state.deleteItemModal} onClose={this.closeDeleteModal} aria-labelledby="form-dialog-title">
            <DialogTitle id="alert-dialog-title">{"Delete Item?"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      <Typography style={{textAlign: 'center'}}> Are you sure you want to delete this item? </Typography>
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => this.closeDeleteModal()} style={{color: '#6b6b6b'}}  autoFocus>
                      Close
                    </Button>
                    <Button onClick={() => this.deleteFromDB(this.state.itemToDelete)} color="secondary">
                      Delete Item
                    </Button>
                  </DialogActions>
            </Dialog>
          </Box>
        }
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


export default withStyles(styles)(ProfileScreen);