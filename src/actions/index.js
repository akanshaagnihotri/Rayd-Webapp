import axios from 'axios';
import { Base, Login} from '../common/api'

export const AuthenticateUserLocally =(dispatch,data)=>{ //When Token Already Stored in LocalStorage
    if(data.token && data.UserName.length>0) {
        const actionToDispatch = {
            type:'SUCCESSFUL_LOGIN',
            payload: {
                token: data.token,
                Username: data.UserName
            }
        };
        dispatch(actionToDispatch);
    }
}

export const AuthenticateUser=(dispatch,userName,password)=>{
const url= Base + Login;

axios.post(url,{
    email:userName,
    password:password
}).then(async (resp)=>{
    let actionToDispatch = {};
    if(resp.data && resp.data.msg=='success') {
        await localStorage.setItem("Rayd_Auth_Token",JSON.stringify({
            token: resp.data.access_token,
            UserName: userName
        }));
        actionToDispatch = {
            type:'SUCCESSFUL_LOGIN',
            payload: {
                token: resp.data.access_token,
                Username: userName
            }
        }

    } else {
        alert(resp.data.msg);
        actionToDispatch={
            type :"FAILED_LOGIN"
        }
    }
    dispatch(actionToDispatch);
}).catch((e)=>{

    console.log("e :" ,e);
    const actionToDispatch={
        type :"FAILED_LOGIN"

    }
    dispatch(actionToDispatch)
})

}

export const ClearLoginData = async dispatch=>{
    await localStorage.setItem("Rayd_Auth_Token", JSON.parse(null));
    dispatch({type: "FAILED_LOGIN"})
};