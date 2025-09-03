import { useEffect, useState } from 'react';
import { Table, Button, Input, Space, Pagination, notification, Popconfirm } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllProductsApi, deleteProductApi, searchProductsApi } from '../util/api';
import { useNavigate } from 'react-router-dom';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();

  const fetchProducts = async (page = 1, limit = 10, category = '') => {
    try {
      setLoading(true);
      const params = { page, limit };
      if (category) params.category = category;
      
      const res = await getAllProductsApi(params);
      
      if (res && res.products) {
        setProducts(res.products);
        setPagination({
          ...pagination,
          current: res.currentPage,
          total: res.total
        });
      }
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: error.message || 'Không thể tải danh sách sản phẩm',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      fetchProducts(1, pagination.pageSize);
      return;
    }
    
    try {
      setLoading(true);
      const res = await searchProductsApi(searchKeyword, 1, pagination.pageSize);
      
      if (res && res.products) {
        setProducts(res.products);
        setPagination({
          ...pagination,
          current: res.currentPage,
          total: res.total
        });
      }
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: error.message || 'Không thể tìm kiếm sản phẩm',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProductApi(id);
      notification.success({
        message: 'Thành công',
        description: 'Xóa sản phẩm thành công!',
      });
      fetchProducts(pagination.current, pagination.pageSize);
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: error.message || 'Không thể xóa sản phẩm',
      });
    }
  };

  const handlePageChange = (page, pageSize) => {
    if (searchKeyword.trim()) {
      searchProductsApi(searchKeyword, page, pageSize);
    } else {
      fetchProducts(page, pageSize);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      width: 220,
      ellipsis: true,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price.toLocaleString('vi-VN')} đ`,
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => navigate(`/products/edit/${record._id}`)}
          />
          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Input
            placeholder="Tìm kiếm sản phẩm"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </Space>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => navigate('/products/create')}
        >
          Thêm sản phẩm
        </Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={products} 
        rowKey="_id"
        loading={loading}
        pagination={false}
      />
      
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default ProductsPage;