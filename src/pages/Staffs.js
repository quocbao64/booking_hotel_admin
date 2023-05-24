import { Row, Col, Card, Table, Button, Typography, Select, Input, message } from "antd";
import { useEffect, useState } from "react";
import "../assets/styles/hotels.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import logout from "../components/utils/logout";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import { format } from "date-fns";

function Tables() {
    const [staffs, setStaffs] = useState([]);
    const history = useHistory();

    const handleGetUsers = async () => {
        try {
            await axios
                .get("http://localhost:3000/staffs", {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((res) => {
                    const users = res.data.data;
                    setStaffs(users);
                })
                .catch((err) => {
                    if (err.response.status === 401) {
                        logout();
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
            title: "Tên người dùng",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Giới tính",
            key: "gender",
            dataIndex: "gender",
        },
        {
            title: "Ngày sinh",
            key: "birthday",
            dataIndex: "birthday",
            render: (value, record) => <span>{format(new Date(value), "dd-MM-yyyy")}</span>,
        },
        {
            title: "Số CMND",
            key: "person_id",
            dataIndex: "person_id",
        },
        {
            title: "Vị trí",
            key: "position",
            dataIndex: "position",
        },
        {
            title: "Lương",
            key: "salary",
            dataIndex: "salary",
            render: (value, record) => (
                <span>
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                        value
                    )}
                </span>
            ),
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
            key: e.staff_id,
            birthday: e.birthday,
            name: e.name,
            gender: e.gender,
            role: e.user_role,
            position: e.position,
            salary: e.salary,
            person_id: e.person_id,
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

    const handleCreateStaff = () => {
        history.push("/staffs/create");
    };

    return (
        <>
            <div className="tabled">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24"
                            title="Danh sách nhân viên"
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
                                        style={{ marginRight: "20px" }}
                                        icon={<SearchOutlined />}>
                                        Tìm kiếm
                                    </Button>
                                    <Button type="primary" onClick={() => handleCreateStaff()}>
                                        Tạo nhân viên
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
