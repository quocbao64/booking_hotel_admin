/*!
=========================================================
* Muse Ant Design Dashboard - v1.0.0
=========================================================
* Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
* Coded by Creative Tim
=========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, Button, Row, Col, Typography, Form, Input, Switch, message } from "antd";
import signinbg from "../assets/images/img-signin.jpg";
import axios from "axios";
function onChange(checked) {
    console.log(`switch to ${checked}`);
}
const { Title } = Typography;
const { Header, Footer, Content } = Layout;
export default class SignIn extends Component {
    render() {
        const onFinish = async (values) => {
            await axios
                .post("http://localhost:3000/login", {
                    user_email: values.email,
                    user_password: values.password,
                })
                .then((response) => {
                    console.log(response);
                    if (response.status === 200) {
                        localStorage.setItem("user", JSON.stringify(response.data.data));
                        localStorage.setItem("isLoggedIn", "true");
                        const role = response.data.data.user.user_role;
                        if (role === 0) {
                            window.location.assign("/dashboard");
                        } else if (role === 2) {
                            window.location.assign("/orders");
                        } else {
                            return message.error("Bạn không có quyền vào trang này");
                        }
                    }
                })
                .catch((err) => {
                    return message.error(err?.response.data.msg);
                });
        };

        const onFinishFailed = (errorInfo) => {
            console.log("failed:", errorInfo);
        };
        return (
            <>
                <Layout className="layout-default layout-signin">
                    <Header>
                        <div className="header-col header-brand">
                            <h5>Rooms</h5>
                        </div>
                    </Header>
                    <Content className="signin">
                        <Row gutter={[24, 0]} justify="space-around">
                            <Col
                                xs={{ span: 24, offset: 0 }}
                                lg={{ span: 6, offset: 2 }}
                                md={{ span: 12 }}>
                                <Title className="mb-15">Đăng nhập</Title>
                                <Title className="font-regular text-muted" level={5}>
                                    Vui lòng điền email và mật khẩu để tiếp tục
                                </Title>
                                <Form
                                    onFinish={onFinish}
                                    onFinishFailed={onFinishFailed}
                                    layout="vertical"
                                    className="row-col">
                                    <Form.Item
                                        className="username"
                                        label="Email"
                                        name="email"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng nhập email!",
                                            },
                                        ]}>
                                        <Input placeholder="Email" />
                                    </Form.Item>

                                    <Form.Item
                                        className="username"
                                        label="Mật khẩu"
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng điền mật khẩu!",
                                            },
                                        ]}>
                                        <Input.Password placeholder="Mật khẩu" />
                                    </Form.Item>

                                    <Form.Item
                                        name="remember"
                                        className="aligin-center"
                                        valuePropName="checked">
                                        <Switch defaultChecked onChange={onChange} />
                                        Ghi nhớ tài khoản
                                    </Form.Item>

                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            style={{ width: "100%" }}>
                                            Đăng nhập
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </Content>
                </Layout>
            </>
        );
    }
}
