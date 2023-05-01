import React from "react";
import { Route, Redirect } from "react-router-dom";

const isAuthenticated = () => {
    const allowRole = [0, 2];
    const user = JSON.parse(localStorage.getItem("user"));
    return localStorage.getItem("isLoggedIn") === "true" && allowRole.includes(user.user.user_role);
};

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) =>
            isAuthenticated() ? (
                <Component {...props} />
            ) : (
                <Redirect to={{ pathname: "/403", state: { from: props.location } }} />
            )
        }
    />
);

export default PrivateRoute;
