import {
    Row,
    Col,
    Card,
    Table,
    message,
    Button,
    Typography,
    Select,
    DatePicker,
    Input,
} from "antd";
import { useEffect, useState } from "react";
import "../assets/styles/hotels.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

function Tables() {
    const [hotels, setHotels] = useState([]);
    const [rooms, setRooms] = useState([]);
    const history = useHistory();

    const handleGetHotels = async () => {
        const response = await axios.get("http://localhost:3000/invoices");
        console.log(response.data.data);
        setHotels(response.data.data);
    };

    const handleGetRooms = async () => {
        const response = await axios.get(`http://localhost:3000/rooms`);
        setRooms(response.data.data);
    };

    useEffect(() => {
        handleGetHotels();
        handleGetRooms();
    }, []);

    const user = JSON.parse(localStorage.getItem("user"));

    function calculateNewPrice(record, newQuantity) {
        const pricePerRoom = parseInt(record.price) / parseInt(record.room_quantity);
        record.price = pricePerRoom * newQuantity;
        return pricePerRoom * newQuantity;
    }

    const [updatedQuantity, setUpdatedQuantity] = useState({});

    const data = hotels.map((e, id) => {
        return {
            key: e.invoice_id,
            name: rooms.filter((i) => i.room_id === e.room_id)[0]?.room_name,
            r_date: e.r_date,
            p_date: e.p_date,
            price: e.price,
            status: e.status,
            room_quantity: e.room_quantity,
        };
    });

    const columns = [
        {
            title: "Tên phòng",
            dataIndex: "name",
            key: "name",
            render: (value) => <Title level={5}>{value}</Title>,
        },
        {
            title: "Số phòng",
            dataIndex: "room_quantity",
            key: "room_quantity",
            width: "10%",
        },
        {
            title: "Ngày thuê",
            key: "r_date",
            dataIndex: "r_date",
            render: (value, record) => <span>{format(new Date(value), "dd-MM-yyyy")}</span>,
        },
        {
            title: "Ngày trả",
            key: "p_date",
            dataIndex: "p_date",
            render: (value, record) => <span>{format(new Date(value), "dd-MM-yyyy")}</span>,
        },
        {
            title: "Giá",
            key: "price",
            dataIndex: "price",
            render: (value, record) => (
                <span>
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                        calculateNewPrice(
                            record,
                            updatedQuantity[record.key] || record.room_quantity
                        )
                    )}
                </span>
            ),
        },
        {
            title: "Trạng thái phòng",
            key: "status",
            dataIndex: "status",
            render: (value, record) => (
                <span>
                    {value === "booked"
                        ? "Đã đặt"
                        : value === "inprogress"
                        ? "Đang ở"
                        : "Đã thanh toán"}
                </span>
            ),
        },
        {
            title: "",
            key: "key",
            dataIndex: "key",
            render: (value, record) => (
                <Button
                    type="primary"
                    onClick={async () => {
                        window.location.assign(`/orders/${record.key}`);
                    }}>
                    Xem chi tiết
                </Button>
            ),
        },
    ];

    const [search, setSearch] = useState("");
    let filterList = [];
    const [dataFiltered, setDataFiltered] = useState(null);

    useEffect(() => {}, [dataFiltered]);

    const handleSearch = () => {
        filterList = data.filter((item) =>
            ["name", "price"].some((field) =>
                item[field].toString().toLowerCase().includes(search.toLowerCase())
            )
        );
        console.log(filterList);
        setDataFiltered(filterList);
    };

    const handleClearInput = () => {
        setSearch("");
        setDataFiltered(null);
    };

    console.log(dataFiltered);

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
                            title="Danh sách phòng"
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
