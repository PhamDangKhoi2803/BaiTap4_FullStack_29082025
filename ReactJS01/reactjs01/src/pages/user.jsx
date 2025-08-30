// src/pages/user.jsx
import React, { useEffect, useState } from "react";
import { notification, Table } from "antd";
import { getUserApi } from "../util/api";

const UserPage = () => {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
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

    fetchUser();
  }, []);

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
  ];

  return (
    <div style={{ padding: 30 }}>
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        rowKey="_id"
      />
    </div>
  );
};

export default UserPage;
