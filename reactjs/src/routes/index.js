import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import HomePage from '../pages/Home';
import LoginPage from '../pages/Login';

export default function routes(props) {

    return (
        <Router>
            <Switch>
                <Route path='/login'>
                    <LoginPage />
                </Route>
                <Route path='/'>
                    <HomePage />
                </Route>
                {/* <PrivateRoute path='/'>
                    <HomePage />
                </PrivateRoute> */}

            </Switch>
        </Router>
    )
}