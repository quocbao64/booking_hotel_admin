import { Button, Card, Form, Input, message, Space, Upload } from "antd";
import { useState } from "react";
import ImgCrop from "antd-img-crop";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import "../../assets/styles/hotels.css";

const UserForm = ({ onFinish }) => {
    const [fileList, setFileList] = useState([]);
    const [open, setOpen] = useState(true);

    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
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

    return (
        <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
            <Form.List name="users">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <Card style={{ marginTop: "16px" }}>
                                <Form.Item style={{ marginBottom: 0 }}>
                                    <Form.Item
                                        name="name"
                                        label="Tên khách sạn"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng nhập tên!",
                                            },
                                        ]}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        name="star"
                                        label="Số sao được đánh giá"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng nhập số sao!",
                                            },
                                        ]}>
                                        <Input type="number" />
                                    </Form.Item>
                                </Form.Item>
                                <Form.Item style={{ marginBottom: 0 }}>
                                    <Form.Item name="address" label="Địa chỉ">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="phone" label="Số điện thoại">
                                        <Input />
                                    </Form.Item>
                                </Form.Item>
                                <Form.Item
                                    name="avatar"
                                    label="Tải ảnh xem trước của phòng (tối đa 5 ảnh)">
                                    <ImgCrop>
                                        <Upload
                                            listType="picture-card"
                                            beforeUpload={handleBeforeUpload}
                                            fileList={fileList}
                                            onChange={onChange}
                                            onPreview={onPreview}
                                            maxCount={5}>
                                            {fileList.length < 5 && "+ Tải"}
                                        </Upload>
                                    </ImgCrop>
                                </Form.Item>
                                <Form.Item className="form-btn">
                                    <Button type="primary" htmlType="submit">
                                        Thêm
                                    </Button>
                                    <Button
                                        type="default"
                                        block
                                        onClick={() => remove()}
                                        style={{ width: "fit-content", marginLeft: "16px" }}>
                                        Hủy bỏ
                                    </Button>
                                </Form.Item>
                            </Card>
                        ))}
                        {open && (
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    style={{ marginTop: "16px" }}
                                    icon={<PlusOutlined />}>
                                    Thêm phòng
                                </Button>
                            </Form.Item>
                        )}
                    </>
                )}
            </Form.List>
        </Form>
    );
};

export default UserForm;
