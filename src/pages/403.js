import { Result, Button } from "antd";

const ForbiddenPage = () => {
    return (
        <Result
            status="403"
            title="403"
            subTitle="Bạn không có quyền truy cập trang này."
            extra={
                <Button type="primary" href="/dashboard">
                    Quay về trang chủ
                </Button>
            }
        />
    );
};

export default ForbiddenPage;
