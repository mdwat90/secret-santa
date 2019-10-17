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
  CircularProgress
} from '@material-ui/core';
import { Link as DomLink } from "react-router-dom";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


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
      loading: false
    }
  }

  componentDidMount() {
    console.log('WISHLIST PROPS:', this.props)

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

  expandPanel = (panel) => {
    this.setState({
      panel: panel,
      panelOpen: !this.state.panelOpen
    })
  }


  getUserData= (userId) => {
    this.setState({
      loading: true
    })

    axios.get('http://localhost:3001/api/getItems', {
      params: {
        user_id: userId
      }
    })
      .then((res) => this.setState({ data: res.data, loading: false}))
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
                  <Typography variant="h5">{this.state.userName} hasn't added any items to their list yet</Typography>
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
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails className={classes.details}>
                          <Typography>
                            {item.notes}
                          </Typography>
                        </ExpansionPanelDetails>
                      </ExpansionPanel>
                    </div>
                ))}

                <Container>
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