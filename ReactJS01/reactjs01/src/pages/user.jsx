// src/pages/user.jsx
import React, { useEffect, useState } from "react";
import { notification, Table, Button, Modal, Form, Input } from "antd";
import { getUserApi, updateUserApi } from "../util/api";

const UserPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
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
        description: error.message || "Không thể tải danh sách user",
      });
    }
  };

  const showEditModal = (record) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await updateUserApi(editingUser._id, values);
      notification.success({ message: "Cập nhật thành công" });
      setIsModalOpen(false);
      setEditingUser(null);
      fetchUser();
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: error.message || "Cập nhật thất bại",
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingUser(null);
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
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="primary" onClick={() => showEditModal(record)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 30 }}>
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        rowKey="_id"
      />
      <Modal
        title="Chỉnh sửa thông tin User"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: "Vui lòng nhập email" }]}>
            <Input disabled />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true, message: "Vui lòng chọn role" }]}>
            <Input disabled />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserPage;
