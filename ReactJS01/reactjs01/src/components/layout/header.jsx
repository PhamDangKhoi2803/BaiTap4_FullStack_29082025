// src/components/layout/Header.jsx
import React, { useContext, useState } from 'react';
import { UsergroupAddOutlined, HomeOutlined, SettingOutlined, ShoppingOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';

const Header = () => {
  const navigate = useNavigate();

  // 1) Gọi hook useState trước khi dùng setCurrent trong bất kỳ chỗ nào
  const [current, setCurrent] = useState('home');

  // 2) Lấy context một cách an toàn: một vài project cung cấp { auth, setAuth }, một số khác trả về object auth trực tiếp.
  const ctx = useContext(AuthContext);
  const auth = ctx?.auth ?? ctx;                // nếu context là { auth, setAuth } thì dùng ctx.auth, nếu là auth trực tiếp thì dùng ctx
  const setAuth = ctx?.setAuth ?? ctx?.setAuthentication ?? (() => {
    console.warn('setAuth not found in AuthContext');
  });

  // 3) Logout handler tách riêng, an toàn
  const handleLogout = () => {
    try {
      localStorage.removeItem('access_token'); // chỉ xóa token cần thiết
      setAuth({
        isAuthenticated: false,
        user: { email: '', name: '' },
      });
      setCurrent('home');
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const onClick = (e) => {
    // e.key là key string của menu item
    setCurrent(e.key);
  };

  // 4) Tạo items sau khi đã có current và auth
  const items = [
    {
      label: <Link to="/">Home Page</Link>,
      key: 'home',
      icon: <HomeOutlined />,
    },
    // hiển thị item "Users" chỉ khi đã auth
    ...(auth?.isAuthenticated
      ? [
          {
            label: <Link to="/user">Users</Link>,
            key: 'user',
            icon: <UsergroupAddOutlined />,
          },
          {
            label: <Link to="/favorites">Yêu thích</Link>, // <-- Thêm dòng này
            key: 'favorites',
            icon: <HeartOutlined />, // Có thể dùng icon khác nếu muốn
          },
        ]
      : []),
      {
        label: <Link to="/products">Products</Link>,
        key: 'products',
        icon: <ShoppingOutlined />,
      },
    {
      // nếu chưa đăng nhập hiển thị "Account" (hoặc 'Welcome' nếu muốn)
      label: auth?.isAuthenticated ? `Welcome ${auth.user?.email ?? ''}` : 'Account',
      key: 'account',
      icon: <SettingOutlined />,
      children: auth?.isAuthenticated
        ? [
            {
              label: <span onClick={handleLogout} style={{ cursor: 'pointer' }}>Đăng xuất</span>,
              key: 'logout',
            },
          ]
        : [
            {
              label: <Link to="/login">Đăng nhập</Link>,
              key: 'login',
            },
          ],
    },
  ];

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};

export default Header;
