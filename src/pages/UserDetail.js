import { Row, Col, Card, Input, Form, Button, Upload, message, Select, Modal } from "antd";
import { useEffect, useState } from "react";
import "../assets/styles/hotels.css";
import axios from "axios";
import ImgCrop from "antd-img-crop";
import { useParams } from "react-router-dom";
import logout from "../components/utils/logout";

function HotelDetail() {
    const [hotel, setHotel] = useState();
    const [form] = Form.useForm();
    const [fileListSlide, setFileListSlide] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const { Option } = Select;
    const { userID } = useParams();

    const onChangeSlide = ({ fileList: newFileList }) => {
        setFileListSlide(newFileList);
    };

    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    const beforeUpload = (file) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        const allowedSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            message.error("You can only upload JPG/PNG file!");
            return false;
        }

        if (file.size > allowedSize) {
            message.error("Image must smaller than 5MB!");
            return false;
        }

        return true;
    };

    const handleBeforeUpload = (file) => {
        return beforeUpload(file) && false; // return false to prevent auto upload
    };

    const handleGetHotel = async () => {
        const response = await axios
            .get(`http://localhost:3000/users/${userID}`, {
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
        setHotel(response.data.data);
    };

    useEffect(() => {
        handleGetHotel();
    }, []);

    useEffect(() => {
        form.setFieldsValue(hotel);
    }, [hotel]);

    async function urlToFile(url) {
        const response = await fetch(url);
        const imageData = await response.blob();

        const file = new File([imageData], url.substring("http://localhost:3000/images/"));
        return file;
    }

    const onFinish = async (values) => {
        values["room_price"] = parseFloat(values["room_price"]);
        console.log(values);
        try {
            const formData = new FormData();

            fileListSlide.forEach((file) => {
                formData.append("avatar", file.originFileObj);
            });
            for (const key in values) {
                formData.append(key, values[key]);
            }
            const response = await axios
                .patch(`http://localhost:3000/users/${userID}`, values, {
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
                window.location.assign("/users");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const [visible, setVisible] = useState(false);

    async function handleDelete() {
        await axios
            .delete(`http://localhost:3000/users/${userID}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    message.success("Xóa tài khoản thành công");
                    setVisible(false);
                    setTimeout(() => {
                        window.location.assign("/users");
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

    return (
        <>
            <div className="tabled">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24"
                            title="Chỉnh sửa tài khoản">
                            <Card>
                                <Form form={form} layout="vertical" onFinish={onFinish}>
                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <Form.Item
                                            name="user_email"
                                            label="Email"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng nhập email!",
                                                },
                                            ]}>
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name="user_name"
                                            label="Tên"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng nhập tên!",
                                                },
                                            ]}>
                                            <Input />
                                        </Form.Item>
                                    </Form.Item>
                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <Form.Item
                                            name="user_phone"
                                            label="Số điện thoại"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng nhập số điện thoại!",
                                                },
                                            ]}>
                                            <Input />
                                        </Form.Item>
                                        <Form.Item name="user_role" label="Vai trò">
                                            <Select>
                                                <Option value={0}>Quản lý</Option>
                                                <Option value={2}>Nhân viên</Option>
                                                <Option value={3}>Người dùng</Option>
                                            </Select>
                                        </Form.Item>
                                    </Form.Item>

                                    <div style={{ marginBottom: "30px" }}>
                                        <Button
                                            type="primary"
                                            style={{ marginRight: "20px" }}
                                            danger
                                            onClick={() => setVisible(true)}>
                                            Xóa tài khoản
                                        </Button>
                                        <Modal
                                            title="Bạn có chắc chắn muốn xóa?"
                                            visible={visible}
                                            onOk={handleDelete}
                                            onCancel={handleCancel}>
                                            <p>Hành động này không thể hoàn tác</p>
                                        </Modal>
                                        <Button htmlType="submit" type="primary">
                                            Sửa thông tin
                                        </Button>
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

export default HotelDetail;
