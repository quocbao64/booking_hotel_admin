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
import logout from "../components/utils/logout";
import moment from "moment";
import { format } from "date-fns";

function HotelDetail() {
    const [hotel, setHotel] = useState();
    const [form] = Form.useForm();
    const [fileListSlide, setFileListSlide] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const { Option } = Select;
    const { staffID } = useParams();
    const [birthday, setBirthday] = useState(new Date());

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
            .get(`http://localhost:3000/staffs/${staffID}`, {
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
        console.log(response);
        setHotel(response.data.data);
        setBirthday(response.data.data.birthday);
        setRole(response.data.data.role);
    };

    useEffect(() => {
        if (staffID !== "create") handleGetHotel();
    }, []);

    useEffect(() => {
        if (staffID !== "create") form.setFieldsValue(hotel);
    }, [hotel]);

    async function urlToFile(url) {
        const response = await fetch(url);
        const imageData = await response.blob();

        const file = new File([imageData], url.substring("http://localhost:3000/images/"));
        return file;
    }

    const [role, setRole] = useState();

    const onFinish = async (values) => {
        values["room_price"] = parseFloat(values["room_price"]);
        if (staffID !== "create") {
            try {
                const response = await axios
                    .patch(`http://localhost:3000/staffs/${staffID}`, values, {
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
                    window.location.assign("/staffs");
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                values["staff_role"] = role;
                values["birthday"] = birthday;
                console.log(values);
                const response = await axios
                    .post(`http://localhost:3000/staffs`, values, {
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
                    message.success("Tạo nhân viên thành công");
                    window.location.assign("/staffs");
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const [visible, setVisible] = useState(false);
    function handleCancel() {
        setVisible(false);
    }

    async function handleDelete() {
        await axios
            .delete(`http://localhost:3000/staffs/${staffID}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    message.success("Xóa nhân viên thành công");
                    setVisible(false);
                    setTimeout(() => {
                        window.location.assign("/staffs");
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

    return (
        <>
            <div className="tabled">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24"
                            title={
                                staffID !== "create"
                                    ? "Chỉnh sửa thông tin nhân viên"
                                    : "Tạo nhân viên và tài khoản"
                            }>
                            <Card>
                                <Form form={form} layout="vertical" onFinish={onFinish}>
                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <Form.Item
                                            name="name"
                                            label="Tên"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng nhập tên!",
                                                },
                                            ]}>
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name="person_id"
                                            label="Số CMND"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng nhập số CMND!",
                                                },
                                            ]}>
                                            <Input type="text" />
                                        </Form.Item>
                                    </Form.Item>
                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <Form.Item name="gender" label="Giới tính">
                                            <Select>
                                                <Option value="Nam">Nam</Option>
                                                <Option value="Nữ">Nữ</Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item name="position" label="Vị trí">
                                            <Select>
                                                <Option value="Fulltime">Fulltime</Option>
                                                <Option value="Parttime">Parttime</Option>
                                            </Select>
                                        </Form.Item>
                                    </Form.Item>
                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <Form.Item label="Vai trò">
                                            <Select value={role} onChange={(e) => setRole(e)}>
                                                <Option value={0}>Admin</Option>
                                                <Option value={2}>Nhân viên</Option>
                                                <Option value={3}>Người dùng</Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item name="salary" label="Lương">
                                            <Input type="number" />
                                        </Form.Item>
                                    </Form.Item>
                                    {staffID === "create" ? (
                                        <>
                                            <Form.Item>
                                                <Form.Item name="user_name" label="Tên người dùng">
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item name="user_password" label="Mật khẩu">
                                                    <Input.Password />
                                                </Form.Item>
                                            </Form.Item>
                                            <Form.Item>
                                                <Form.Item name="user_email" label="Email">
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item name="user_phone" label="Số điện thoại">
                                                    <Input />
                                                </Form.Item>
                                            </Form.Item>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                    <Form.Item>
                                        <Form.Item label="Ngày sinh">
                                            <DatePicker
                                                value={moment(birthday)}
                                                onChange={(date, dateString) =>
                                                    setBirthday(
                                                        format(new Date(dateString), "yyyy-MM-dd")
                                                    )
                                                }
                                            />
                                        </Form.Item>
                                    </Form.Item>

                                    <div style={{ marginBottom: "30px" }}>
                                        {staffID !== "create" ? (
                                            <>
                                                <Button
                                                    type="primary"
                                                    style={{ marginRight: "20px" }}
                                                    danger
                                                    onClick={() => setVisible(true)}
                                                    disabled={
                                                        hotel?.status === "paid" ? true : false
                                                    }>
                                                    Xóa nhân viên
                                                </Button>
                                                <Modal
                                                    title="Bạn có chắc chắn muốn xóa?"
                                                    visible={visible}
                                                    onOk={handleDelete}
                                                    onCancel={handleCancel}
                                                    okText="Xác nhận"
                                                    cancelText="Hủy bỏ">
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
                                                Tạo nhân viên
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

export default HotelDetail;
