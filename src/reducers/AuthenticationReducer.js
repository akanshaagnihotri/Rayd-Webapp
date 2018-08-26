
const initialState = {
    auth_Token:null,
    Username: null
};

const AuthenticationReducer=(state=initialState,action)=>{
    switch(action.type){
        case 'SUCCESSFUL_LOGIN': return{
            auth_Token: action.payload.token,
            Username: action.payload.Username
        };
        case 'FAILED_LOGIN': return initialState;
        default : return state;
    }
}
export default AuthenticationReducer;