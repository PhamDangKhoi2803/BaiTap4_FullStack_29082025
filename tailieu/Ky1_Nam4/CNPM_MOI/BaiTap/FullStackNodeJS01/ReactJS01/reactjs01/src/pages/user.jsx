// src/pages/user.jsx
import React, { useEffect, useState, useContext } from "react";
import { notification, Table, Button, Modal, Form, Input, Space } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { getUserApi, updateUserApi } from "../util/api";
import { AuthContext } from "../components/context/auth.context";

const UserPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  
  const { auth } = useContext(AuthContext);
  const isAdmin = auth.user.role === "Admin";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUserApi();

      if (!res?.message) {
        setDataSource(res);
      } else {
        notification.error({
          message: "Unauthorized",
          description: res?.message || "Bạn không có quyền truy cập",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể tải thông tin user",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      
      // Chỉ admin mới có thể cập nhật role
      if (!isAdmin) {
        delete values.role;
      }
      
      await updateUserApi(editingUser._id, values);
      
      notification.success({
        message: "Thành công",
        description: "Cập nhật thông tin thành công!",
      });
      
      setEditModalVisible(false);
      fetchUsers();
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể cập nhật thông tin",
      });
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => {
        // Admin có thể sửa tất cả, user thường chỉ có thể sửa thông tin của mình
        if (isAdmin || record._id === auth.user._id) {
          return (
            <Button 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
            >
              Sửa
            </Button>
          );
        }
        return null;
      },
    },
  ];

  return (
    <div style={{ padding: 30 }}>
      <h2>{isAdmin ? "Danh sách người dùng" : "Thông tin cá nhân"}</h2>
      
      <Table
        bordered
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        rowKey="_id"
      />
      
      <Modal
        title="Cập nhật thông tin"
        open={editModalVisible}
        onOk={handleUpdate}
        onCancel={() => setEditModalVisible(false)}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
          >
            <Input disabled />
          </Form.Item>
          
          {isAdmin && (
            <Form.Item
              name="role"
              label="Vai trò"
              rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
            >
              <Input />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default UserPage;