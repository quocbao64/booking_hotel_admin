import { message } from "antd";

const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    message.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
    setTimeout(() => {
        window.location.replace("/sign-in");
    }, 3000);
};

export default logout;
