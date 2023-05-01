import React from "react";
import { Route, Redirect } from "react-router-dom";

const isAuthenticated = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
        return window.location.replace("/sign-in");
    }
    return isLoggedIn === "true" && user.user.user_role === 0;
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
