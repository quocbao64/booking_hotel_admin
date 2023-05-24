import { Row, Col, Card, Table, Button, Typography, Select, Input, message, Modal } from "antd";
import { useEffect, useState } from "react";
import "../assets/styles/services.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import logout from "../components/utils/logout";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";

function Tables() {
    const [services, setServices] = useState([]);
    const history = useHistory();

    const handleGetUsers = async () => {
        try {
            await axios
                .get("http://localhost:3000/services")
                .then((res) => {
                    setServices(res.data.data);
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
                logout();
            }
        }
    };

    useEffect(() => {
        handleGetUsers();
    }, []);

    // table code start
    const columns = [
        {
            title: "ID",
            dataIndex: "service_id",
            key: "service_id",
        },
        {
            title: "Tên dịch vụ",
            dataIndex: "service_name",
            key: "service_name",
        },
        {
            title: "Giá",
            key: "service_price",
            dataIndex: "service_price",
            render: (value, record) => (
                <span>
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                        value
                    )}
                </span>
            ),
        },
        {
            title: "",
            key: "service_id",
            dataIndex: "service_id",
            render: (value, record) => (
                <>
                    <Button type="primary" onClick={() => handleClickUpdate(record.key)}>
                        Chỉnh sửa
                    </Button>
                    <Button
                        style={{ marginLeft: "20px" }}
                        type="primary"
                        danger
                        onClick={() => handeDelete(value)}>
                        Xóa
                    </Button>
                </>
            ),
        },
    ];

    // update
    const [visibleUpdate, setVisibleUpdate] = useState(false);
    const [currentKeyUpdate, setCurrentKeyUpdate] = useState(null);
    const [serviceName, setServiceName] = useState("");
    const [servicePrice, setServicePrice] = useState();

    const handleClickUpdate = (key) => {
        console.log(key);
        console.log(data);
        setServiceName(data[key]?.service_name);
        setServicePrice(data[key].service_price);
        setCurrentKeyUpdate(key);
        setVisibleUpdate(true);
    };

    async function handleUpdate(id) {
        await axios
            .patch(`http://localhost:3000/services/${id}`, {
                service_name: serviceName,
                service_price: servicePrice,
            })
            .then((res) => {
                if (res.status === 204) {
                    message.success("Cập nhật thành công");
                    setVisibleUpdate(false);
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                }
            })
            .catch((err) => {
                message.error("Lỗi không xác định");
            });
    }

    function handleCancelUpdate() {
        setVisibleUpdate(false);
    }

    // create
    const [visibleCreate, setVisibleCreate] = useState(false);
    const [serviceNameCreate, setServiceNameCreate] = useState("");
    const [servicePriceCreate, setServicePriceCreate] = useState();

    const handleClickCreate = () => {
        setVisibleCreate(true);
    };

    function handleCancelCreate() {
        setVisibleCreate(false);
    }

    async function handleCreate() {
        await axios
            .post("http://localhost:3000/services", {
                service_name: serviceNameCreate,
                service_price: servicePriceCreate,
            })
            .then((res) => {
                console.log(res);
                if (res.status === 201) {
                    message.success("Tạo dịch vụ thành công");
                    setVisibleCreate(false);
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                }
            })
            .catch((err) => {
                message.error("Lỗi không xác định");
            });
    }

    // delete
    async function handeDelete(id) {
        await axios
            .delete(`http://localhost:3000/services/${id}`)
            .then((res) => {
                if (res.status === 204) {
                    message.success("Xóa dịch vụ thành công");
                    setVisibleCreate(false);
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                }
            })
            .catch((err) => {
                message.error("Lỗi không xác định");
            });
    }

    const data = services.map((e, id) => {
        return {
            key: id,
            service_id: e.service_id,
            service_name: e.service_name,
            service_price: e.service_price,
        };
    });

    const [search, setSearch] = useState("");
    let filterList = [];
    const [dataFiltered, setDataFiltered] = useState(null);

    useEffect(() => {}, [dataFiltered]);

    const handleSearch = () => {
        filterList = services.filter((item) =>
            ["service_name", "service_price"].some((field) =>
                item[field].toLowerCase().includes(search.toLowerCase())
            )
        );
        setDataFiltered(
            filterList.map((e) => {
                return {
                    service_id: e.service_id,
                    service_name: e.service_name,
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
                            title="Danh sách dịch vụ"
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
                                    <>
                                        <Button onClick={() => handleClickCreate()} type="primary">
                                            Tạo dịch vụ
                                        </Button>
                                        <Modal
                                            title="Tạo dịch vụ"
                                            visible={visibleCreate}
                                            onOk={() => handleCreate()}
                                            onCancel={handleCancelCreate}>
                                            <label>Tên dịch vụ</label>
                                            <Input
                                                style={{ marginTop: "5px", marginBottom: "20px" }}
                                                value={serviceNameCreate}
                                                onChange={(e) =>
                                                    setServiceNameCreate(e.target.value)
                                                }
                                            />
                                            <label>Giá</label>
                                            <Input
                                                type="number"
                                                style={{ marginTop: "5px" }}
                                                value={servicePriceCreate}
                                                onChange={(e) =>
                                                    setServicePriceCreate(e.target.value)
                                                }
                                            />
                                        </Modal>
                                    </>
                                </div>
                            }>
                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    dataSource={dataFiltered === null ? data : dataFiltered}
                                    pagination={false}
                                    className="ant-border-space service-table"
                                    locale={{
                                        emptyText: <span style={noDataStyle}>{noDataMessage}</span>,
                                    }}
                                />
                                <Modal
                                    title="Chỉnh sửa dịch vụ"
                                    visible={visibleUpdate}
                                    onOk={() => handleUpdate(data[currentKeyUpdate]?.service_id)}
                                    onCancel={handleCancelUpdate}>
                                    <label>Tên dịch vụ</label>
                                    <Input
                                        style={{ marginTop: "5px", marginBottom: "20px" }}
                                        value={serviceName}
                                        onChange={(e) => setServiceName(e.target.value)}
                                    />
                                    <label>Giá</label>
                                    <Input
                                        type="number"
                                        style={{ marginTop: "5px" }}
                                        value={servicePrice}
                                        onChange={(e) => setServicePrice(e.target.value)}
                                    />
                                </Modal>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Tables;
