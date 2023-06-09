import { Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Hotels from "./pages/Rooms";
import SignIn from "./pages/SignIn";
import HotelDetail from "./pages/RoomDetail";
import Main from "./components/layout/Main";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import PrivateRoute from "./components/route/privateRoute";
import StaffRoute from "./components/route/staffRoute";
import Orders from "./pages/Orders";
import ForbiddenPage from "./pages/403";
import Users from "./pages/Users";
import UserDetail from "./pages/UserDetail";
import OrderDetail from "./pages/OrderDetail";
import Staffs from "./pages/Staffs";
import StaffDetail from "./pages/StaffDetail";
import Services from "./pages/Services";

function App() {
    return (
        <div className="App">
            <Switch>
                <Route path="/sign-in" exact component={SignIn} />
                <Main>
                    <PrivateRoute exact path="/" component={Home} />
                    <PrivateRoute exact path="/dashboard" component={Home} />
                    <PrivateRoute exact path="/rooms" component={Hotels} />
                    <PrivateRoute exact path="/rooms/:roomID" component={HotelDetail} />
                    <PrivateRoute exact path="/users" component={Users} />
                    <PrivateRoute exact path="/users/:userID" component={UserDetail} />
                    <PrivateRoute exact path="/staffs" component={Staffs} />
                    <PrivateRoute exact path="/staffs/:staffID" component={StaffDetail} />
                    <PrivateRoute exact path="/services" component={Services} />
                    <StaffRoute exact path="/orders" component={Orders} />
                    <StaffRoute exact path="/orders/:orderID" component={OrderDetail} />
                    <Route path="/403" exact component={ForbiddenPage} />
                </Main>
            </Switch>
        </div>
    );
}

export default App;
