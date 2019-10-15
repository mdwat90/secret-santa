import React, {Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/styles';
import { AppBar, Button,Typography, Toolbar } from '@material-ui/core';
import { logOut } from '../../actions/UserActions';


const useStyles = makeStyles({
    root: {
        background: '#4f92ff'
    },
    link: {
        marginRight: 10
    },
    lastLink: {
        flexGrow: 1
    },
    logout: {
        color: 'white'
    },
    title: {
        marginRight: 20,
        color: '#ff5e5e',
        fontSize: '1.5vw'
    }
  });


function Navbar(props) {
    const classes = useStyles();

    const { logOut } = props;

    console.log('NAVBAR PROPS:', props)
    return (
        <AppBar position={'sticky'} className={classes.root}>
            <Toolbar>
                <Typography className={classes.title}>
                    XMAS LIST
                </Typography>
                {/* <Link to="/register">Register</Link> */}
                {props.loggedIn ? 
                    <Typography className={classes.link}>
                        <Link to="/Profile" style={{ textDecoration: 'none', color: 'white' }}>Profile</Link>
                    </Typography>
                    :
                    null
                }
                <Typography className={classes.lastLink}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>My Groups</Link>
                </Typography>
                <Button onClick={() => logOut()} className={classes.logout}>Logout</Button>
            </Toolbar>
        </AppBar>
    ) 
}

const mapStateToProps = state => {
    const { user: {user_info, loggedIn, new_user} } = state;
    return {
      user_info: user_info,
      loggedIn: loggedIn,
      new_user: new_user
    }
  }

  const mapDispatchToProps = {
    logOut
  }
  
  
  const Nav = connect(
    mapStateToProps,
    mapDispatchToProps
  )(Navbar);
  
  

export default Nav;