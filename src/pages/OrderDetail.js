import {
    Row,
    Col,
    Card,
    Input,
    Form,
    Button,
    Upload,
    message,
    Select,
    DatePicker,
    Modal,
} from "antd";
import { useEffect, useState } from "react";
import "../assets/styles/hotels.css";
import axios from "axios";
import ImgCrop from "antd-img-crop";
import { useParams } from "react-router-dom";
import moment from "moment";
import { format } from "date-fns";
import logout from "../components/utils/logout";

function OrderDetail() {
    const [hotel, setHotel] = useState();
    const [form] = Form.useForm();
    const user = JSON.parse(localStorage.getItem("user"));
    const { Option } = Select;
    const { orderID } = useParams();
    const [r_date, setRDate] = useState(new Date());
    const [p_date, setPDate] = useState(new Date());
    const [status, setStatus] = useState();
    const [rooms, setRooms] = useState([]);
    const [email, setEmail] = useState();

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
                    logout();
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
        setEmail(res.email);
    };

    useEffect(() => {
        if (orderID !== "create") handleGetHotel();
    }, []);

    useEffect(() => {
        handleGetRooms();
    }, []);

    useEffect(() => {
        if (hotel && orderID !== "create") {
            form.setFieldsValue({
                room_name: rooms.filter((e) => e.room_id === hotel.room_id)[0]?.room_name,
                room_quantity: hotel.room_quantity,
                price: hotel.price,
            });
        }
    }, [hotel, rooms.length]);

    const onFinish = async (values) => {
        if (orderID !== "create") {
            const params = {
                price,
                status,
                r_date,
                p_date,
                room_id: roomSelected,
                room_quantity: quantity,
                email,
            };
            console.log(params);
            try {
                const response = await axios
                    .patch(`http://localhost:3000/invoices/${orderID}`, params, {
                        headers: { Authorization: `Bearer ${user.token}` },
                    })
                    .catch((err) => {
                        if (err.response.status === 401) {
                            logout();
                        } else {
                            message.error("Lỗi không xác định");
                        }
                    });
                if (response.status === 200) {
                    message.success("Cập nhật thành công");
                    setTimeout(() => {
                        window.location.assign("/orders");
                    }, 2000);
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            const params = {
                price,
                status,
                r_date,
                p_date,
                room_id: roomSelected,
                room_quantity: 1,
                user_uuid: user.user.uuid,
                email,
            };
            console.log(params);
            try {
                const response = await axios
                    .post(`http://localhost:3000/invoices`, params, {
                        headers: { Authorization: `Bearer ${user.token}` },
                    })
                    .catch((err) => {
                        if (err.response.status === 401) {
                            logout();
                        } else {
                            message.error("Lỗi không xác định");
                        }
                    });
                if (response.status === 201) {
                    message.success("Tạo thành công");
                    window.location.assign("/orders");
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const [quantity, setQuantity] = useState();
    const [price, setPrice] = useState();

    function calculateNewPrice(price, newQuantity) {
        const pricePerRoom = parseInt(price) / parseInt(hotel?.room_quantity);
        return parseInt(pricePerRoom) * parseInt(newQuantity);
    }

    const [visible, setVisible] = useState(false);
    const [roomSelected, setRoomSelected] = useState();

    async function handleDelete() {
        await axios
            .delete(`http://localhost:3000/invoices/${orderID}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    message.success("Hủy đặt phòng thành công");
                    setVisible(false);
                    setTimeout(() => {
                        window.location.assign("/orders");
                    }, 1500);
                }
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    logout();
                } else {
                    message.error("Lỗi không xác định");
                }
            });
    }

    function handleCancel() {
        setVisible(false);
    }

    const handleChangeRoom = (value) => {
        setRoomSelected(value);
        setPrice(rooms.find((e) => e.room_id === value).room_price);
    };

    return (
        <>
            <div className="tabled">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24"
                            title={
                                orderID !== "create"
                                    ? "Chỉnh sửa thông tin đơn đặt phòng"
                                    : "Tạo đơn đặt phòng"
                            }>
                            <Card>
                                <Form form={form} layout="vertical" onFinish={onFinish}>
                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <Form.Item label="Email khách hàng">
                                            <Input
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </Form.Item>
                                        <Form.Item name="room_name" label="Tên phòng">
                                            <Select
                                                options={rooms?.map((room) => {
                                                    return {
                                                        value: room.room_id,
                                                        label: "Phòng " + room.room_name,
                                                    };
                                                })}
                                                onChange={handleChangeRoom}
                                            />
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
                                            label="Trạng thái"
                                            style={{ marginLeft: "20px" }}>
                                            <Select value={status} onChange={(e) => setStatus(e)}>
                                                <Option value="booked">Đã đặt</Option>
                                                <Option value="inprogress">Đang ở</Option>
                                                <Option value="paid">Đã thanh toán</Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item></Form.Item>
                                    </Form.Item>

                                    <div style={{ marginBottom: "30px" }}>
                                        {orderID !== "create" ? (
                                            <>
                                                <Button
                                                    type="primary"
                                                    style={{ marginRight: "20px" }}
                                                    danger
                                                    onClick={() => setVisible(true)}
                                                    disabled={
                                                        hotel?.status === "paid" ? true : false
                                                    }>
                                                    Hủy đặt phòng
                                                </Button>
                                                <Modal
                                                    title="Bạn có chắc chắn muốn hủy?"
                                                    visible={visible}
                                                    onOk={handleDelete}
                                                    onCancel={handleCancel}>
                                                    <p>Hành động này không thể hoàn tác</p>
                                                </Modal>
                                                <Button
                                                    disabled={
                                                        hotel?.status === "paid" ? true : false
                                                    }
                                                    htmlType="submit"
                                                    type="primary">
                                                    Sửa thông tin
                                                </Button>
                                            </>
                                        ) : (
                                            <Button htmlType="submit" type="primary">
                                                Tạo đơn
                                            </Button>
                                        )}
                                    </div>
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
