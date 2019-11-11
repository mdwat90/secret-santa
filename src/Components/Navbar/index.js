import React, {Component, useState } from 'react';
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
        color:'#ff476f'
    }
  });


function Navbar(props) {
    const classes = useStyles();

    const { logOut } = props;

    const [activeTab, setTab] = useState('Groups');

    return (
        <AppBar position={'sticky'} className={classes.root}>
            <Toolbar>
                {/* <Typography className={classes.title}>
                    XMAS
                </Typography> */}
                
                <div className={classes.link}>
                    <Typography>
                        <Link to="/profile" style={{ textDecoration: 'none', color: 'white' }} onClick={() => setTab('Profile')}>My Wishlist</Link>
                    </Typography>
                        {activeTab === 'Profile' ?
                            <div style={{height: '2px', width:'83px', backgroundColor: 'white'}} />
                        :
                            <div style={{height: '2px'}} />
                        }
                </div>
                
                <div  className={classes.lastLink}>
                    <Typography>
                        <Link to="/" style={{ textDecoration: 'none', color: 'white' }} onClick={() => setTab('Groups')}>My Groups</Link>
                    </Typography>
                        {activeTab === 'Groups' ?
                            <div style={{height: '2px', width:'80px', backgroundColor: 'white'}} />
                        :
                            <div style={{height: '2px'}} />
                        }
                </div>
               
                
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