import { Redirect, Route } from "react-router-dom";
export default function PrivateRoute({ children, ...rest }) {
    const userToken = JSON.parse(sessionStorage.getItem("USERLOGINEDTOKEN"));
    return (
        <Route
            {...rest}
            render={() =>
                userToken ? children : <Redirect to="/login" />
            }
        />
    );
}