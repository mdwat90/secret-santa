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
  Grid,
  Container, 
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Box, 
  Link,
  Typography, 
  TextField, 
  CircularProgress,
  ButtonBase
} from '@material-ui/core';
import { Link as DomLink } from "react-router-dom";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import Linkify from 'react-linkify';


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
    margin: '1vh',
    width: '80%'
  },
  heading: {
    // fontSize: '4vh'
  },
  details: {
    backgroundColor: '#d1d1d1'
  },
  drawButton: {
    color: '#4f92ff',  
    borderColor: '#4f92ff'
  },
  button: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    width: '25%',
    padding: '0 30px',
    margin: '5vh'
  },
};

class WishList extends Component {
  // initialize our state
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      user_id: null,
      userName: null,
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
      openPurchaseModal: false
    }
  }

  componentDidMount() {
    console.log('WISHLIST PROPS:', this.props)

    window.scrollTo(0, 0);

    this.setState({
      user_id: this.props.match.params.id,
      userName: this.props.location.state.user
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

  openPurchaseModal = (event, item) => {
    event.stopPropagation();
    console.log('UDAPTE PURCHASED ITEM:', item)
    this.setState({
      openPurchaseModal: true,
      itemToUpdate: item._id
    })
  }

  closePurchaseModal = () => {
    this.setState({
      openPurchaseModal: false,
      itemToUpdate: null
    })
  }

  expandPanel = (panel) => {
    this.setState({
      panel: panel,
      panelOpen: !this.state.panelOpen
    })
  }


  getUserData= (userId) => {
    console.log('GETTING USER DATA')
    this.setState({
      loading: true
    })

    axios.get('/api/getItems', {
      params: {
        user_id: userId
      }
    })
      .then((res) => this.setState({ data: res.data, loading: false}))
  };
  
  purchaseItem= (id) => {
    console.log('ITEM ID:', id)

    let component = this;

    axios.post('/api/updateItem', {
      _id: id,
      user_id: component.state.user_id,
      update: { purchased: true },
    })
    .then(function (response) {
      console.log('AXIOS RESPONSE:', response)
      component.setState({
        openPurchaseModal: false,
        itemToUpdate: null
      })
      component.getUserData(component.state.user_id);
    })
    .catch(function (error) {
      // console.log('AXIOS ERROR:', error)
    })
  };

  componentDecorator = (href, text, key) => (
    <a href={href} key={key} target="_blank" style={{'color': '#4f92ff'}}>
      {text}
    </a>
  );
 


  render() {
    const { data } = this.state;
    const { classes } = this.props;

    let userName;
    let upperCaseName;
    if(this.state.userName) {
      userName = this.state.userName;
      upperCaseName = userName.replace(/^\w/, c => c.toUpperCase());
    }

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
            <Container container justify='center' className={classes.container}>
              {data.length <= 0 ? 
                <Container style={{height: '10vh', marginTop: '10vh'}}>
                  <Typography variant="h5">{upperCaseName} hasn't added any items to their wishlist yet</Typography>
                </Container>
                : 
                [<Typography variant="h5" style={{color: '#6b6b6b', marginBottom: '3vh'}}>{upperCaseName}'s Wishlist</Typography>,
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
                              <Typography style={{textAlign:'left', marginRight: '1vw'}}>
                                {item.link ?
                                  <Link href= {item.link} onClick={(event) => {event.stopPropagation()}} target={'_blank'} className={classes.link}>
                                    {item.description}
                                  </Link>
                                  :
                                  <Typography className={classes.noLink} style={{display: 'inline'}}>{item.description}</Typography>
                                }
                              </Typography>
                            </Grid>
                            <Grid container justify={'flex-end'} direction={'row'}   style={{width: 25 }}>
                              <Grid container justify={'flex-end'} alignItems='center'>
                                {item.purchased ? 
                                  <Grid item>
                                      <CheckCircleOutlineOutlinedIcon style={{color: '#51e07e'}}/>
                                  </Grid>
                                  :
                                  <Grid item>
                                    <ButtonBase style={{borderRadius: 3}}>
                                      <ShoppingCartOutlinedIcon style={{color: '#6b6b6b', height: '0.75em'}} onClick={(event) => this.openPurchaseModal(event, item)} />
                                    </ButtonBase>
                                  </Grid>
                                }
                              </Grid>
                            </Grid>
                          </ExpansionPanelSummary>
                          {item.notes ? 
                            <ExpansionPanelDetails className={classes.details}>
                              <Typography style={{wordBreak: 'break-word', overflowWrap: 'break-word','whiteSpace': 'pre-line',  textAlign: 'left' }}>
                                <Linkify componentDecorator={this.componentDecorator}>
                                  {item.notes}
                                </Linkify>
                              </Typography> 
                            </ExpansionPanelDetails>
                            :
                            null
                          }
                        </ExpansionPanel>
                      </div>
                   </Grid>
                  </Grid>
                  ))]
                }

                <Container style={{marginTop: '5vh'}}>
                  <DomLink to="/groups/my-groups" style={{ textDecoration: 'none', color: '#4f92ff' }}>
                      <Button 
                        variant="outlined"
                        disabled={false} 
                        className={classes.drawButton} 
                      >
                        <Typography>
                          Go Back
                        </Typography>
                      </Button>
                  </DomLink>
                </Container>
            </Container>
          </Box>
        }


        {/* Purchase Item Modal */}
        <Dialog open={this.state.openPurchaseModal} onClose={this.closePurchaseModal} aria-labelledby="form-dialog-title">
            <DialogTitle id="alert-dialog-title">{"Mark as Purchased?"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      <Typography style={{textAlign: 'center'}}>Do you want to mark this item as purchased?</Typography>
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => this.closePurchaseModal()} style={{color: '#6b6b6b'}}  autoFocus>
                      Cancel
                    </Button>
                    <Button onClick={() => this.purchaseItem(this.state.itemToUpdate)} style={{color: '#4f92ff'}}>
                      Confirm
                    </Button>
                  </DialogActions>
            </Dialog>
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


const WishListScreen = connect(
  mapStateToProps,
  null
)(WishList);


export default withStyles(styles)(WishListScreen);