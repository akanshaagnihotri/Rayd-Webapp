import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'
import { LoginPage, HomePage } from '../components'

const RootRouter = () => {
    return(
        <Router>
            <Switch>
                <Route exact path={'/'} component={LoginPage}/>
                <Route path={'/Home'} component={HomePage}/>
            </Switch>
        </Router>
    )
};

export default RootRouter;