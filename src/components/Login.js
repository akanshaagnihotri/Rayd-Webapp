import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { AuthenticateUser, AuthenticateUserLocally } from '../actions';
import { Redirect } from 'react-router-dom'

const materialStyles = (theme) => ({
    cardContainer: {
        marginTop: 45,
        display: 'flex',
        justifyContent: 'center',
        padding: '20px',
        textAlign:  'left'
    },
    heading: {
      color: '#1565C0'
    },
    textField: {
        width: '90%',
        marginBottom: 20,
        marginLeft: '5%'
    },
    button: {
        borderRadius: 0,
        width: '90%',
        marginTop: 20,
        marginLeft: '5%',
        marginBottom: 20
    }
});

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Username: "",
            Password: "",
            initialTokenChecking: true
        }
    }
    componentDidMount= async ()=>{
        const UnParsedTokenFromStorage = await localStorage.getItem("Rayd_Auth_Token");
        const tokenFromStorage = JSON.parse(UnParsedTokenFromStorage);
        if(tokenFromStorage && tokenFromStorage.UserName && tokenFromStorage.token){
            this.props.AuthUserLocally(tokenFromStorage);
        }
        this.setState({initialTokenChecking: true});
    }

    render() {
       const { classes, authReducerState } = this.props;
       const {initialTokenChecking} = this.state;
       if(authReducerState.auth_Token && authReducerState.Username) {
           return(
               <Redirect to={'/Home'}/>
           )
       }
       else if(initialTokenChecking === true && this.props.authReducerState.auth_Token === null){
           return(
               <div style={{padding: 10}}>
                   <Grid container>
                       <Grid item md={3}/>
                       <Grid item md={6}>
                           <Card className={classes.cardContainer}>
                               <Grid container>
                                   <Grid container md={12}>
                                       <h1 className={classes.heading}>Log in</h1>
                                   </Grid>
                                   <Grid container md={12}>
                                       <TextField
                                           id="Username"
                                           label="Username"
                                           value={this.state.Username}
                                           onChange={(e) => this.setState({Username: e.target.value})}
                                           className={classes.textField}
                                       />
                                       <TextField
                                           id="Password"
                                           label="Password"
                                           type="password"
                                           value={this.state.Password}
                                           onChange={(e) => this.setState({Password: e.target.value})}
                                           className={classes.textField}
                                       />
                                   </Grid>
                                   <Grid container md={12}>

                                       <Button onClick={()=>this.props.AuthUser(this.state.Username, this.state.Password)} variant="outlined" color="primary" className={classes.button}>
                                           LOGIN
                                       </Button>
                                   </Grid>
                               </Grid>
                           </Card>
                       </Grid>
                       <Grid item md={3}/>
                   </Grid>
               </div>
           );
       } else{
           return("")
       }

    }
}
const mapStateToProps=(state)=>{
    return {
        authReducerState: state.Authentication
    }
}
const mapDispatchToProps=(dispatch)=>{
    return {
        AuthUser: (username,pass) =>{AuthenticateUser(dispatch,username,pass)},
        AuthUserLocally: token => {AuthenticateUserLocally(dispatch, token)}
    }
}

const styledLoginPage = withStyles(materialStyles())(LoginPage);

export default connect(mapStateToProps, mapDispatchToProps)(styledLoginPage);