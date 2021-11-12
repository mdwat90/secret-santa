import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {
  login,
  userExistsError,
  connectionError,
} from '../../actions/UserActions';
import { withStyles } from '@material-ui/styles';
import { BrowserRouter as Link } from 'react-router-dom';
import {
  Button,
  Container,
  CircularProgress,
  Typography,
  Grid,
} from '@material-ui/core';
import NameDrawingCard from './Cards/nameDrawCard';
import GeneralGroupCard from './Cards/generalGroupCard';

const styles = {
  root: {
    background: '#4f92ff',
    margin: 'auto',
    height: '100vh',
    paddingTop: '15vh',
  },
  container: {
    background: '#fff',
    textAlign: 'center',
    marginTop: '3vw',
  },
  buttonContainer: {
    background: '#fff',
    textAlign: 'center',
    marginTop: '10vw',
  },
  form: {
    background: '#fff',
    textAlign: 'center',
    width: '50%',
    height: '80%',
    borderRadius: 5,
  },
  title: {
    margin: '1vh',
  },
  subText: {
    margin: '2vh',
    color: '#b8b8b8',
  },
  card: {
    padding: '2vh',
  },
  textInput: {
    margin: '1vh',
    width: '80%',
  },
  button: {
    margin: '2vh',
  },
  icon: {
    margin: 5,
    color: '#b8b8b8',
    cursor: 'pointer',
    position: 'absolute',
  },
  deleteIcon: {
    height: '20px',
    width: '20px',
    cursor: 'pointer',
  },
  drawButton: {
    color: '#4f92ff',
    borderColor: '#4f92ff',
    backgroundColor: 'white',
    margin: '4vh',
  },
  delete: {
    color: 'red',
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
    margin: '4vw',
  },
};

class Groups extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      loading: null,
    };
  }

  componentDidMount() {
    // this.setState({
    //   selectedUserId: this.props.user_info.uidSelected,
    //   selectedUserName: this.props.user_info.selectedUserName
    // }, () => {
    //   console.log('SELECTED USER:', this.state.selectedUserName)
    window.scrollTo(0, 0);

    this.getUserGroups(this.props.user_info._id);
    // this.getSelectedUsersData(this.state.selectedUserId);
    // })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loggedIn !== this.props.loggedIn) {
      this.props.history.push('/profile');
    }
  }

  getUserGroups = (userId) => {
    this.setState({
      loading: true,
    });

    axios
      .get('/api/getUserGroups', {
        params: {
          user_id: userId,
        },
      })
      .then((res) => {
        // console.log('RESPONSE:', res.data);
        this.setState({ userGroups: res.data, loading: false });
      })
      .catch((error) => {
        // console.log('AXIOS GET USER GROUPS ERROR', error)
      });
  };

  routeChange(uid, name) {
    let path = `/wish-list/${uid}`;
    this.history.push(path, { user: name });
  }

  render() {
    const { user_info, classes } = this.props;

    return (
      <div>
        {this.state.loading ? (
          <Container style={{ height: '20vh', marginTop: '10vh' }}>
            <CircularProgress style={{ color: '#ff476f' }} />
          </Container>
        ) : (
          <div>
            <Grid container wrap="wrap" direction="row" spacing={3}>
              {this.state.userGroups.length <= 0 &&
              this.state.loading === false ? (
                <Container style={{ height: '20vh', marginTop: '10vh' }}>
                  <Typography variant="h5" style={{ marginBottom: '2vh' }}>
                    You haven't joined any groups yet!
                  </Typography>
                  <Typography variant="body1" style={{ marginBottom: '2vh' }}>
                    When you create or join a group, it will show up here.
                  </Typography>
                </Container>
              ) : (
                this.state.userGroups.map((group, idx) => {
                  return (
                    <Grid item xs={12} md={6} lg={4} key={group._id}>
                      {group.nameDrawing ? (
                        <NameDrawingCard
                          group={group}
                          idx={idx}
                          user={this.props.user}
                          getUserGroups={this.getUserGroups}
                          routeChange={this.routeChange}
                          {...this.props}
                        />
                      ) : (
                        <GeneralGroupCard
                          group={group}
                          idx={idx}
                          user={this.props.user}
                          getUserGroups={this.getUserGroups}
                          routeChange={this.routeChange}
                          {...this.props}
                        />
                      )}
                    </Grid>
                  );
                })
              )}
            </Grid>

            <Container xs={12} m={6} lg={6} className={classes.buttonContainer}>
              <Link
                to="/groups/create-group"
                style={{ textDecoration: 'none', color: '#fff' }}
              >
                <Button className={classes.link}>
                  <Typography style={{ color: '#fff' }}>
                    Create Group
                  </Typography>
                </Button>
              </Link>

              <Link
                to="/groups/join-group"
                style={{ textDecoration: 'none', color: '#fff' }}
              >
                <Button className={classes.link}>
                  <Typography style={{ color: '#fff' }}>Join Group</Typography>
                </Button>
              </Link>
            </Container>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    user: { user_info, loggedIn, userExistsErr, connectionErr },
  } = state;

  return {
    user_info: user_info,
    loggedIn: loggedIn,
    userExistsErr: userExistsErr,
    connectionErr: connectionErr,
  };
};

const mapDispatchToProps = {
  login,
  userExistsError,
  connectionError,
};

const GroupsScreen = connect(mapStateToProps, mapDispatchToProps)(Groups);

export default withStyles(styles)(GroupsScreen);
