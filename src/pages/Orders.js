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

const { Title } = Typography;
const { Option } = Select;

function Tables() {
    const [hotels, setHotels] = useState([]);
    const [rooms, setRooms] = useState([]);
    const history = useHistory();
    const [quantity, setQuantity] = useState(Array.from({}, () => -1));

    const handleGetHotels = async () => {
        const response = await axios.get("http://localhost:3000/invoices");
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
            render: (value, record) => (
                <Input
                    type="number"
                    defaultValue={value}
                    onChange={(e) => {
                        const newQuantity = e.target.value;
                        setUpdatedQuantity({ ...updatedQuantity, [record.key]: newQuantity });
                        record.room_quantity = newQuantity;
                    }}
                />
            ),
        },
        {
            title: "Ngày thuê",
            key: "r_date",
            dataIndex: "r_date",
            render: (value, record) => (
                <span>
                    <DatePicker
                        defaultValue={moment(value)}
                        onChange={(date, dateString) =>
                            (record.r_date = format(new Date(dateString), "yyyy-MM-dd"))
                        }
                    />
                </span>
            ),
        },
        {
            title: "Ngày nhận",
            key: "p_date",
            dataIndex: "p_date",
            render: (value, record) => (
                <span>
                    <DatePicker
                        defaultValue={moment(value)}
                        onChange={(date, dateString) =>
                            (record.p_date = format(new Date(dateString), "yyyy-MM-dd"))
                        }
                    />
                </span>
            ),
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
                <Select defaultValue={value} onChange={(e) => (record.status = e)}>
                    <Option value="booked">Đã đặt</Option>
                    <Option value="inprogress">Đang ở</Option>
                    <Option value="paid">Đã thanh toán</Option>
                </Select>
            ),
        },
        {
            title: "",
            key: "key",
            dataIndex: "key",
            render: (value, record) => (
                <Button
                    type="primary"
                    disabled={record.status === "paid" ? true : false}
                    onClick={async () => {
                        record.room_quantity = updatedQuantity[record.key] || record.room_quantity;
                        record.price = calculateNewPrice(
                            record,
                            updatedQuantity[record.key] || record.room_quantity
                        );
                        const response = await axios.patch(
                            `http://localhost:3000/invoices/${value}`,
                            record,
                            {
                                headers: {
                                    Authorization: `Bearer ${user.token}`,
                                },
                            }
                        );
                        if (response.data.message === "update invoice successfully") {
                            message.success("Cập nhật hóa đơn thành công");
                            window.location.reload();
                        }
                    }}>
                    Cập nhật
                </Button>
            ),
        },
    ];

    return (
        <>
            <div className="tabled">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24"
                            title="Danh sách phòng">
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
