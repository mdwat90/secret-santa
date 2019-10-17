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
    width: '75%',
    marginTop: '5vh'
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
  textInput: {
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
      loading: false
    }
  }

  componentDidMount() {
    console.log('PROFILE PROPS:', this.props)

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
  
  editForm = (item) => {
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

    axios.get('http://localhost:3001/api/getItems', {
      params: {
        user_id: userId
      }
    })
      .then((res) => this.setState({ data: res.data, loading: false }))
  };


  addNewItem = (description, link, notes) => {
    let component = this;

    var validateLink = link.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
    if(validateLink === null) {
      // console.log('NOT A VALID LINK')
      this.setState({
        linkError: true
      })
    }
    else {
      // console.log('GOOD TO GO')
      component.closeAddForm();

      this.setState({
        linkError: false
      })
      axios.post('http://localhost:3001/api/newItem', {
        user_id: this.props.user_info._id,
        description: description,
        link: link,
        notes: notes
      })
      .then(function (response) {
        // console.log('AXIOS RESPONSE:', response)
        component.getUserData(component.props.user_info._id);
      })
      .catch(function (error) {
        console.log('AXIOS ERROR:', error)
      });
    }
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

  updateDB = (idToUpdate, description, link, notes) => {
    let component = this;

    console.log('UPDATE ITEM:', idToUpdate)
    console.log('Description UPDATE:', description)
    console.log('LINK UPDATE:', link)
    console.log('NOTES UPDATE:', notes)

    var validateLink = link.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
    if(validateLink === null) {
      console.log('NOT A VALID LINK')
      this.setState({
        linkError: true
      })
    }
    else {
      console.log('GOOD TO GO')
      component.closeEditForm();

      axios.post('http://localhost:3001/api/updateItem', {
        _id: idToUpdate,
        update: { description: description, link: link, notes: notes},
      })
      .then(function (response) {
        // console.log('AXIOS RESPONSE:', response)
        component.getUserData(component.props.user_info._id);
      })
      .catch(function (error) {
        console.log('AXIOS ERROR:', error)
      })

    }

    
  };


  render() {
    const { data } = this.state;
    const { classes } = this.props;
    return (
      <div>
        {this.state.loading ?
          <Box className={classes.root}>
            <Container className={classes.container} style={{marginTop: '10vh'}}>
              <CircularProgress style={{color:'#ff476f'}} />
            </Container>
          </Box>
          :
          <Box className={classes.root}>
            <Container className={classes.container}>
              {data.length <= 0 ? 
                <Container style={{height: '10vh', marginTop: '10vh'}}>
                  <Typography variant="h5">You haven't added any items to your list</Typography>
                </Container>
                : 
                data.map((item, index) => (
                  <div key={item._id}>
                      <ExpansionPanel 
                        style={this.state.panel === item._id && this.state.panelOpen ? {marginBottom: '4vh'} : {marginBottom: '2vh'}} 
                        expanded={this.state.panel === item._id && this.state.panelOpen} 
                        onChange={() => this.expandPanel(item._id)}>
                        <ExpansionPanelSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1bh-content"
                          id="panel1bh-header"
                        >
                          <Grid container justify={'flex-start'}>
                            <Typography className={classes.heading}>
                              <Link href= {item.link} onClick={() => this.preventDefault} target={'_blank'} className={classes.link}>
                                {item.description}
                              </Link>
                            </Typography>
                          </Grid>
                          <Grid container justify={'center'} direction={'column'}>
                            <Grid container justify={'flex-end'}>
                                <DeleteIcon onClick={() => this.deleteFromDB(item._id)} className={classes.icon}/>
                                <EditIcon onClick={() => this.editForm(item)} className={classes.icon}/>
                            </Grid>
                          </Grid>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails className={classes.details}>
                          <Typography>
                            {item.notes}
                          </Typography>
                        </ExpansionPanelDetails>
                      </ExpansionPanel>
                    </div>
                ))
              }

                <Container style={data.length > 0 ? {marginTop: '5vh'} : null }>
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
                  required
                  error={this.state.linkError ? true : false}
                  id="standard-error"
                  margin="dense"
                  label={this.state.linkError ? "Must be a valid link": "Item link"}
                  type="name"
                  fullWidth
                  className={this.state.linkError ? null : classes.textInput}
                  value={this.state.link}
                  onChange={(e) => this.setState({ link: e.target.value })}
                />
                <TextField
                  multiline={true}
                  margin="dense"
                  label="Additional notes"
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
                  required
                  error={this.state.linkError ? true : false}
                  id="standard-error"
                  margin="dense"
                  label={this.state.linkError ? "Must be a valid link": "Item link"}
                  type="name"
                  fullWidth
                  className={classes.textInput}
                  onChange={(e) => this.setState({ link: e.target.value })}
                />
                <TextField
                  multiline={true}
                  margin="dense"
                  label="Additional notes"
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