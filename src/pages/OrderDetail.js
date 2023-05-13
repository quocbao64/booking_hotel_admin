import { Row, Col, Card, Input, Form, Button, Upload, message, Select, DatePicker } from "antd";
import { useEffect, useState } from "react";
import "../assets/styles/hotels.css";
import axios from "axios";
import ImgCrop from "antd-img-crop";
import { useParams } from "react-router-dom";
import moment from "moment";
import { format } from "date-fns";

function OrderDetail() {
    const [hotel, setHotel] = useState();
    const [form] = Form.useForm();
    const user = JSON.parse(localStorage.getItem("user"));
    const { Option } = Select;
    const { orderID } = useParams();
    const [r_date, setRDate] = useState();
    const [p_date, setPDate] = useState();
    const [status, setStatus] = useState();
    const [rooms, setRooms] = useState([]);

    const handleGetRooms = async () => {
        const response = await axios.get(`http://localhost:3000/rooms/`);
        setRooms(response.data.data);
    };

    const handleGetHotel = async () => {
        const response = await axios
            .get(`http://localhost:3000/invoices/${orderID}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
                } else {
                    message.error("Lỗi không xác định");
                }
            });
        const res = response.data.data;
        setHotel(res);
        setPDate(res.p_date);
        setRDate(res.r_date);
        setStatus(res.status);
        setPrice(res.price);
        setQuantity(res.room_quantity);
    };

    useEffect(() => {
        handleGetHotel();
    }, []);

    useEffect(() => {
        handleGetRooms();
    }, []);

    useEffect(() => {
        if (hotel) {
            form.setFieldsValue({
                room_name: rooms.filter((e) => e.room_id === hotel.room_id)[0]?.room_name,
                room_quantity: hotel.room_quantity,
                price: hotel.price,
            });
        }
    }, [hotel, rooms.length]);

    const onFinish = async (values) => {
        const params = {
            price,
            status,
            r_date,
            p_date,
            room_id: hotel.room_id,
            room_quantity: quantity,
        };
        console.log(params);
        try {
            const response = await axios
                .patch(`http://localhost:3000/invoices/${orderID}`, params, {
                    headers: { Authorization: `Bearer ${user.token}` },
                })
                .catch((err) => {
                    if (err.response.status === 401) {
                        message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
                    } else {
                        message.error("Lỗi không xác định");
                    }
                });
            if (response.status === 200) {
                message.success("Cập nhật thành công");
                window.location.assign("/orders");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const [quantity, setQuantity] = useState();
    const [price, setPrice] = useState();

    function calculateNewPrice(price, newQuantity) {
        const pricePerRoom = parseInt(price) / parseInt(hotel.room_quantity);
        return parseInt(pricePerRoom) * parseInt(newQuantity);
    }

    console.log(price);

    return (
        <>
            <div className="tabled">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24"
                            title="Chỉnh sửa thông tin hóa đơn">
                            <Card>
                                <Form form={form} layout="vertical" onFinish={onFinish}>
                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <Form.Item name="room_name" label="Tên phòng">
                                            <Input disabled />
                                        </Form.Item>
                                        <Form.Item label="Giá">
                                            <Input value={price} />
                                        </Form.Item>
                                    </Form.Item>
                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <Form.Item label="Ngày thuê">
                                            <DatePicker
                                                value={moment(r_date)}
                                                onChange={(date, dateString) =>
                                                    setRDate(
                                                        format(new Date(dateString), "yyyy-MM-dd")
                                                    )
                                                }
                                            />
                                        </Form.Item>
                                        <Form.Item label="Ngày trả">
                                            <DatePicker
                                                value={moment(p_date)}
                                                onChange={(date, dateString) =>
                                                    setPDate(
                                                        format(new Date(dateString), "yyyy-MM-dd")
                                                    )
                                                }
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="room_quantity"
                                            label="Số phòng"
                                            style={{ marginLeft: "20px" }}>
                                            <Input
                                                type="number"
                                                min={1}
                                                onChange={(e) => {
                                                    setQuantity(e.target.value);
                                                    setPrice(
                                                        calculateNewPrice(
                                                            hotel?.price,
                                                            e.target.value
                                                        )
                                                    );
                                                }}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Trạng thái"
                                            style={{ marginLeft: "20px" }}>
                                            <Select value={status} onChange={(e) => setStatus(e)}>
                                                <Option value="booked">Đã đặt</Option>
                                                <Option value="inprogress">Đang ở</Option>
                                                <Option value="paid">Đã thanh toán</Option>
                                            </Select>
                                        </Form.Item>
                                    </Form.Item>

                                    <Button
                                        disabled={hotel?.status === "paid" ? true : false}
                                        htmlType="submit"
                                        type="primary">
                                        Sửa thông tin
                                    </Button>
                                </Form>
                            </Card>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default OrderDetail;
