// src/pages/RegisterPage.jsx
import React from 'react';
import { Button, Col, Form, Input, notification, Row } from 'antd';
import { createUserApi } from '../util/api';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const RegisterPage = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { name, email, password } = values;
    try {
      const res = await createUserApi(name, email, password);

      if (res && !res.error) {
        notification.success({
          message: 'Tạo tài khoản',
          description: 'Đăng ký thành công!',
        });
        navigate('/login');
      } else {
        notification.error({
          message: 'Tạo tài khoản',
          description: res?.message || 'Đăng ký thất bại!',
        });
      }
    } catch (err) {
      notification.error({
        message: 'Tạo tài khoản',
        description: err.message || 'Có lỗi xảy ra!',
      });
    }
  };

  return (
    <Row justify="center" style={{ marginTop: 30 }}>
      <Col xs={24} sm={20} md={12} lg={8}>
        <div
          style={{
            padding: 20,
            border: '1px solid #ccc',
            borderRadius: 8,
            background: '#fff',
          }}
        >
          <legend style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>
            Đăng ký tài khoản
          </legend>

          <Form
            name="register"
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

            <Form.Item
              label="Tên hiển thị"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
            >
              <Input placeholder="Nhập tên" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Đăng ký
              </Button>
            </Form.Item>

            <Form.Item>
              <Link to="/">
                <ArrowLeftOutlined /> Quay lại trang chủ
              </Link>
              <div style={{ textAlign: 'center', marginTop: 10 }}>
                Đã có tài khoản? <Link to="/login">Đăng nhập tại đây</Link>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default RegisterPage;