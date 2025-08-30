import React, { useContext, useState } from 'react';
import { Button, Col, Form, Input, notification, Row } from 'antd';
import { loginApi } from '../util/api';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/context/auth.context';
import { ArrowLeftOutlined } from '@ant-design/icons';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    const { email, password } = values;
    setLoading(true);
    try {
      const res = await loginApi(email, password);
      // console.log(res); // Có thể bật để debug

      if (res && res.user && res.user.EC === 0) {
        localStorage.setItem("access_token", res.user.access_token);

        notification.success({
          message: 'Đăng nhập',
          description: 'Thành công!',
        });

        setAuth({
          isAuthenticated: true,
          user: {
            email: res.user.user?.email ?? "",
            name: res.user.user?.name ?? "",
          },
        });

        navigate("/");
      } else {
        notification.error({
          message: 'Đăng nhập',
          description: res?.message || "Sai email hoặc mật khẩu!",
        });
      }
    } catch (err) {
      notification.error({
        message: 'Đăng nhập',
        description: err.message || "Có lỗi xảy ra!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center" style={{ marginTop: 30 }}>
      <Col xs={24} sm={20} md={12} lg={8}>
        <div
          style={{
            padding: 20,
            border: "1px solid #ccc",
            borderRadius: 8,
            background: "#fff",
          }}
        >
          <legend style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>
            Đăng nhập
          </legend>

          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Đăng nhập
              </Button>
            </Form.Item>

            <Form.Item>
              <Link to="/">
                <ArrowLeftOutlined /> Quay lại trang chủ
              </Link>
              <div style={{ textAlign: "center", marginTop: 10 }}>
                Chưa có tài khoản? <Link to="/register">Đăng ký tại đây</Link>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default LoginPage;