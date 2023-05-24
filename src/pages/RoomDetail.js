import { Row, Col, Card, Input, Form, Button, Upload, message, Modal } from "antd";
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
    const { roomID } = useParams();
    const user = JSON.parse(localStorage.getItem("user"));

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
        if (roomID !== "create") {
            try {
                const response = await axios.get(`http://localhost:3000/rooms/${roomID}`);
                setHotel(response.data.data);
                const imgArr = response.data.data.room_imgs.split(",");
                let newFileList = [];
                imgArr.forEach((e) => {
                    newFileList.push({
                        name: e,
                        filename: e,
                        url: e.trim(),
                    });
                });
                setFileListSlide(newFileList);
            } catch (err) {
                console.log(err);
            }
        }
    };

    useEffect(() => {
        handleGetHotel();
    }, []);

    useEffect(() => {
        if (roomID !== "create") {
            form.setFieldsValue(hotel);
        }
    }, [hotel]);

    async function urlToFile(url) {
        const response = await fetch(url);
        const imageData = await response.blob();

        const file = new File([imageData], url.substring("http://localhost:3000/images/"));
        return file;
    }

    const onFinish = async (values) => {
        values["room_price"] = parseFloat(values["room_price"]);
        values["hotel_id"] = 1;
        try {
            const formData = new FormData();
            for (const file of fileListSlide) {
                if (!file.originFileObj) {
                    const files = await urlToFile(file.url);
                    formData.append("room_imgs", files);
                } else {
                    formData.append("room_imgs", file.originFileObj);
                }
            }
            if (roomID !== "create") {
                const response = await axios
                    .patch(`http://localhost:3000/rooms/${roomID}`, formData, {
                        headers: { Authorization: `Bearer ${user.token}` },
                    })
                    .catch((err) => {
                        if (err.response.status === 401) {
                            logout();
                        } else {
                            message.error("Lỗi không xác định");
                        }
                    });

                const response2 = await axios
                    .patch(`http://localhost:3000/rooms/${roomID}`, values, {
                        headers: { Authorization: `Bearer ${user.token}` },
                    })
                    .catch((err) => {
                        if (err.response.status === 401) {
                            logout();
                        } else {
                            message.error("Lỗi không xác định");
                        }
                    });

                if (response.status === 204 && response2.status === 204) {
                    message.success("Cập nhật thành công");
                    window.location.assign("/rooms");
                }
            } else {
                for (const key in values) {
                    formData.append(key, values[key]);
                }
                const response = await axios
                    .post(`http://localhost:3000/rooms`, formData, {
                        headers: {
                            "content-type": "multipart/form-data",
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

                if (response.status === 201) {
                    message.success("Tạo phòng thành công");
                    window.location.assign("/rooms");
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const [visible, setVisible] = useState(false);

    async function handleDelete() {
        await axios
            .delete(`http://localhost:3000/rooms/${roomID}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    message.success("Xóa phòng thành công");
                    setVisible(false);
                    setTimeout(() => {
                        window.location.assign("/rooms");
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
                            title={roomID !== "create" ? "Chỉnh sửa chi tiết phòng" : "Tạo phòng"}>
                            <Card>
                                <Form form={form} layout="vertical" onFinish={onFinish}>
                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <Form.Item
                                            name="room_name"
                                            label="Tên phòng"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng nhập tên!",
                                                },
                                            ]}>
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name="room_price"
                                            label="Giá"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng nhập giá!",
                                                },
                                            ]}>
                                            <Input type="number" />
                                        </Form.Item>
                                    </Form.Item>
                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <Form.Item
                                            name="room_beds"
                                            label="Số giường"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng nhập số giường!",
                                                },
                                            ]}>
                                            <Input type="number" />
                                        </Form.Item>
                                        <Form.Item
                                            name="room_num_people"
                                            label="Số người tối đa"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng nhập số người!",
                                                },
                                            ]}>
                                            <Input type="number" />
                                        </Form.Item>
                                    </Form.Item>
                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <Form.Item
                                            name="room_surcharge"
                                            label="Phụ thu"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng nhập giá phụ thu!",
                                                },
                                            ]}>
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name="room_desc"
                                            label="Mô tả ngắn"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng nhập mô tả!",
                                                },
                                            ]}>
                                            <Input />
                                        </Form.Item>
                                    </Form.Item>
                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <Form.Item
                                            name="room_area"
                                            label="Diện tích phòng"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng nhập khu phòng!",
                                                },
                                            ]}>
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name="room_quantity"
                                            label="Số lượng phòng"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng nhập số phòng!",
                                                },
                                            ]}>
                                            <Input type="number" />
                                        </Form.Item>
                                    </Form.Item>
                                    <Form.Item label="Tải ảnh xem trước của phòng (tối đa 5 ảnh)">
                                        <ImgCrop>
                                            <Upload
                                                listType="picture-card"
                                                beforeUpload={handleBeforeUpload}
                                                fileList={fileListSlide}
                                                onChange={onChangeSlide}
                                                onPreview={onPreview}
                                                maxCount={5}>
                                                {fileListSlide.length < 5 && "+ Tải"}
                                            </Upload>
                                        </ImgCrop>
                                    </Form.Item>

                                    <div style={{ marginBottom: "30px" }}>
                                        <Button
                                            type="primary"
                                            style={{ marginRight: "20px" }}
                                            danger
                                            onClick={() => setVisible(true)}>
                                            Xóa phòng
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
