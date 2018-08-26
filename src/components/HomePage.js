import React, { Component } from 'react';
import { AuthenticateUser, AuthenticateUserLocally } from "../actions";
import { ClearLoginData } from '../actions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import { withStyles } from "@material-ui/core/styles/index";
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import {Base, Load, Utils, Click, Nav} from '../common/api';
import PinchZoomPan from "react-responsive-pinch-zoom-pan";

const materialStyles = (theme) => ({
    cardContainer: {
        marginTop: 45,
        display: 'flex',
        justifyContent: 'center',
        padding: '20px',
        textAlign:  'left',
        marginBottom: 10
    },
    progressBarRoot: {
        flexGrow: 1,
        marginTop: 20
    },
    heading: {
        color: '#1565C0'
    },
    textField: {
        width: '90%',
        marginBottom: 20,
        marginLeft: '5%'
    },
    choiceButton: {
        borderRadius: 0,
        margin: 1,
        marginTop: 15,
        flex:1,
        minWidth:'24%'
    }
});


class HomePage extends Component{
    constructor(props){
       super(props);
       this.state ={
           CredentialsValidated: false,
           initialImageLoaded: false,
           initialButtonsLoaded: false,
           currentImageUrl : "",
           currentProgress: 0,
           buttonActivated: false,
           buttonsData: [],
           dataSize: 1000000000,
           currentSelected: null
       }
    }
    loadInitialImage = () => {
        const { authReducerState } = this.props;
        const url = Base+Load+'?&email='+authReducerState.Username;
        axios.get(url).then(resp => {
            this.setState({
                initialImageLoaded: true,
                currentImageUrl: resp.data.url,
                currentProgress: resp.data.progress
            });
        }).catch(err => (console.log("Initial Load Error: ", err)))
    };
    loadInitialButtons = () => {
        const { authReducerState } = this.props;
        const url = Base+Utils
        axios.get(url).then(resp => {
            this.setState({
                initialButtonsLoaded: true,
                buttonsData: resp.data.class,
                dataSize: resp.data.data_size
            });
        }).catch(err => (console.log("Initial Buttons Load Error: ", err)))
    };
    responseSubmit = (classSelected) => {
        const { authReducerState } = this.props;
        const { currentProgress } = this.state;
        const url = Base+Click;
        axios.post(url,{
            email: authReducerState.Username,
            class: classSelected,
            progress: currentProgress
        }).then(resp => {
            this.setState({currentSelected: classSelected})

        }).catch(err => (console.log("Response Submit Error: ", err)));
    };
    navigateImages = type => {
        const { currentProgress, currentSelected } = this.state;
        const url = Base+Nav;
        if(type === 'next') {
            if(currentSelected) {
                axios.post(url,{
                    progress: currentProgress,
                    click: type
                }).then(resp => {
                    console.log(resp.data);
                    this.setState({currentSelected: null,
                            currentImageUrl: "",
                            currentProgress: resp.data.progress,
                            currentSelected: resp.data.class,
                            buttonActivated: false},
                        ()=>this.setState({currentImageUrl: resp.data.url})
                    );
                }).catch(err => (console.log("Navigation Error: ", err)));
            } else {
                alert("Please Select the Class For Current Image before proceeding further !!");
            }
        } else {
            axios.post(url,{
                progress: currentProgress,
                click: type
            }).then(resp => {
                console.log(resp.data);
                this.setState({currentSelected: null,
                        currentImageUrl: "",
                        currentProgress: resp.data.progress,
                        currentSelected: resp.data.class,
                        buttonActivated: false},
                    ()=>this.setState({currentImageUrl: resp.data.url})
                );
            }).catch(err => (console.log("Navigation Error: ", err)));
        }
    };
    render(){
       const {
           CredentialsValidated,
           initialImageLoaded,
           currentImageUrl,
           currentProgress,
           dataSize,
           initialButtonsLoaded,
           buttonsData,
           buttonActivated,
           currentSelected
       } = this.state;
       const { authReducerState, resetLogin, classes } = this.props;

       if(authReducerState.Username && authReducerState.auth_Token){
           if(!CredentialsValidated){
               this.setState({CredentialsValidated: true})
           }
           if(!initialImageLoaded) {
               this.loadInitialImage()
           }
           if(!initialButtonsLoaded) {
               this.loadInitialButtons()
           }
           return(
               <div style={{padding: 10}}>
                   <Grid container>
                       <Grid item md={4}/>
                       <Grid item md={4}>
                           <div className={classes.progressBarRoot}>
                               <h2 align="center">{currentProgress} / {dataSize}</h2>
                               <LinearProgress color="secondary" variant="determinate" value={currentProgress * 100/dataSize} />
                           </div>
                           <Card className={classes.cardContainer}>
                               <Grid container>
                                   <Grid container md={12}>
                                       <div onLoad={()=>{this.setState({buttonActivated: true})}} style={{ width: '100%', height: '100%' }}>
                                           <PinchZoomPan maxScale={3}>
                                               <img src={currentImageUrl} width={'100%'}/>
                                           </PinchZoomPan>
                                       </div>
                                   </Grid>
                                   <Grid style={{display: 'flex', justifyContent:'center', alignItems:'center', flexWrap: 'wrap'}} container md={12}>
                                            {
                                                buttonsData.map((data, index)=>{
                                                    return(
                                                        <Button key={"Class"+index} disabled={!buttonActivated} onClick={()=>this.responseSubmit(data)} variant={currentSelected === data ? "contained" : "outlined"} color="primary" className={classes.choiceButton}>
                                                            {data}
                                                        </Button>
                                                    )
                                                })
                                            }
                                   </Grid>
                               </Grid>
                           </Card>
                           <Grid container>
                               <Grid item xs={5} lg={5} md={5}>
                                   <Button onClick={()=> this.navigateImages('previous')} fullWidth variant="outlined" color="primary">
                                       Previous
                                   </Button>
                               </Grid>
                               <Grid item md={2} xs={2} lg={2}/>
                               <Grid item xs={5} lg={5} md={5}>
                                   <Button onClick={()=> this.navigateImages('next')} fullWidth variant="outlined" color="primary">
                                       Next
                                   </Button>
                               </Grid>
                           </Grid>
                       </Grid>
                       <Grid item md={4}/>
                   </Grid>
               </div>
           )
       } else {
            if(!CredentialsValidated){
                this.setState({CredentialsValidated: true}, resetLogin)
            }
            return(
                <Redirect to={'/'}/>
            )
       }
    }
};

const mapStateToProps=(state)=>{
    return {
        authReducerState: state.Authentication
    }
};

const mapDispatchToProps=(dispatch)=>{
    return {
        resetLogin: ()=> {ClearLoginData(dispatch)}
    }
}

const styledHomePage = withStyles(materialStyles())(HomePage);

export default connect(mapStateToProps, mapDispatchToProps)(styledHomePage);