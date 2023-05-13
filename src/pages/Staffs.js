import { Row, Col, Card, Table, Button, Typography, Select, Input, message } from "antd";
import { useEffect, useState } from "react";
import "../assets/styles/hotels.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import logout from "../components/utils/logout";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";

function Tables() {
    const [staffs, setStaffs] = useState([]);
    const history = useHistory();

    const handleGetUsers = async () => {
        try {
            await axios
                .get("http://localhost:3000/users", {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((res) => {
                    const users = res.data.data;
                    setStaffs(users.filter((i) => i.user_role === 2));
                })
                .catch((err) => {
                    if (err.response.status === 401) {
                        message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
                    } else {
                        message.error("Lỗi không xác định");
                    }
                });
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
            key: "phone",
            dataIndex: "phone",
        },
        {
            title: "Vai trò",
            key: "role",
            dataIndex: "role",
            render: (value) => {
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
                        history.push(`/staffs/${value}`);
                    }}>
                    Chỉnh sửa
                </Button>
            ),
        },
    ];

    const data = staffs.map((e) => {
        return {
            key: e.user_uuid,
            email: e.user_email,
            name: e.user_name,
            phone: e.user_phone,
            role: e.user_role,
        };
    });

    const [search, setSearch] = useState("");
    let filterList = [];
    const [dataFiltered, setDataFiltered] = useState(null);

    useEffect(() => {}, [dataFiltered]);

    const handleSearch = () => {
        filterList = staffs.filter((item) =>
            ["user_email", "user_name", "user_phone"].some((field) =>
                item[field].toLowerCase().includes(search.toLowerCase())
            )
        );
        setDataFiltered(
            filterList.map((e) => {
                return {
                    key: e.user_uuid,
                    email: e.user_email,
                    name: e.user_name,
                    phone: e.user_phone,
                    role: e.user_role,
                };
            })
        );
    };

    const handleClearInput = () => {
        setSearch("");
        setDataFiltered(null);
    };

    const noDataMessage = "Không có dữ liệu để hiển thị";
    const noDataStyle = { fontWeight: "bold" };

    return (
        <>
            <div className="tabled">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24"
                            title="Danh sách người dùng"
                            extra={
                                <div style={{ display: "flex" }}>
                                    <Input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Nhập từ khóa"
                                        style={{ marginRight: "10px" }}
                                        suffix={
                                            <CloseOutlined onClick={() => handleClearInput()} />
                                        }
                                    />
                                    <Button
                                        onClick={() => handleSearch()}
                                        type="primary"
                                        icon={<SearchOutlined />}>
                                        Tìm kiếm
                                    </Button>
                                </div>
                            }>
                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    dataSource={dataFiltered === null ? data : dataFiltered}
                                    pagination={false}
                                    className="ant-border-space"
                                    locale={{
                                        emptyText: <span style={noDataStyle}>{noDataMessage}</span>,
                                    }}
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
