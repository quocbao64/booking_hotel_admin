import { Row, Col, Card, Table, Button, Typography, Select } from "antd";
import { useEffect, useState } from "react";
import "../assets/styles/hotels.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import logout from "../components/utils/logout";

function Tables() {
    const [users, setUsers] = useState([]);
    const history = useHistory();

    const handleGetUsers = async () => {
        try {
            const response = await axios.get("http://localhost:3000/users", {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setUsers(response.data.data);
        } catch (err) {
            if (err.response.status === 401) {
                console.log(err);
                logout();
            }
        }
    };

    useEffect(() => {
        handleGetUsers();
    }, []);

    const user = JSON.parse(localStorage.getItem("user"));

    // table code start
    const columns = [
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Tên người dùng",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Số điện thoại",
            key: "r_date",
            dataIndex: "r_date",
        },
        {
            title: "Vai trò",
            key: "role",
            dataIndex: "role",
            render: (value) => {
                console.log(value);
                return value === 0 ? "Quản lý" : value === 2 ? "Nhân viên" : "Người dùng";
            },
        },
        {
            title: "",
            key: "key",
            dataIndex: "key",
            render: (value) => (
                <Button
                    type="primary"
                    onClick={() => {
                        history.push(`/users/${value}`);
                    }}>
                    Chỉnh sửa
                </Button>
            ),
        },
    ];

    const data = users.map((e) => {
        return {
            key: e.user_uuid,
            email: e.user_email,
            name: e.user_name,
            phone: e.user_phone,
            role: e.user_role,
        };
    });

    return (
        <>
            <div className="tabled">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24"
                            title="Danh sách người dùng">
                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    dataSource={data}
                                    pagination={false}
                                    className="ant-border-space"
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Tables;
