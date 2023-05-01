/*!
=========================================================
* Muse Ant Design Dashboard - v1.0.0
=========================================================
* Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
* Coded by Creative Tim
=========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import { Row, Col, Card, Table, message, Button, Typography } from "antd";
import { useEffect, useState } from "react";
import "../assets/styles/hotels.css";
import axios from "axios";
import { useHistory } from "react-router-dom";

const { Title } = Typography;

// table code start
const columns = [
    {
        title: "Tên phòng",
        dataIndex: "name",
        key: "name",
        render: (value) => (
            <Title level={5}>
                <a href="">{value}</a>
            </Title>
        ),
    },
    {
        title: "Số giường",
        dataIndex: "bed",
        key: "bed",
    },
    {
        title: "Mô tả",
        key: "desc",
        dataIndex: "desc",
    },
    {
        title: "Khu vực phòng",
        key: "area",
        dataIndex: "area",
    },
    {
        title: "Số người",
        key: "people",
        dataIndex: "people",
    },
    {
        title: "Giá",
        key: "price",
        dataIndex: "price",
        render: (value) => (
            <span>
                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                    value
                )}
            </span>
        ),
    },
    {
        title: "Phụ thu",
        key: "surcharge",
        dataIndex: "surcharge",
        render: (value) => (
            <span>
                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                    value
                )}
            </span>
        ),
    },
    {
        title: "",
        key: "key",
        dataIndex: "key",
        render: (value) => (
            <a href={`rooms/${value}`}>
                <Button type="primary">Sửa</Button>
            </a>
        ),
    },
];

function Tables() {
    const [hotels, setHotels] = useState([]);
    const history = useHistory();

    const handleGetHotels = async () => {
        const response = await axios.get("http://localhost:3000/rooms");
        console.log(response);
        setHotels(response.data.data);
    };

    useEffect(() => {
        handleGetHotels();
    }, []);

    const data = hotels.map((e, id) => {
        return {
            key: e.room_id,
            name: e.room_name,
            bed: e.room_beds,
            area: e.room_area,
            people: e.room_num_people,
            desc: e.room_desc,
            price: e.room_price,
            surcharge: e.room_surcharge,
        };
    });

    const handleCreateRoom = () => {
        history.push("/rooms/create");
    };

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
                                <Button type="primary" onClick={() => handleCreateRoom()}>
                                    Tạo phòng
                                </Button>
                            }>
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
