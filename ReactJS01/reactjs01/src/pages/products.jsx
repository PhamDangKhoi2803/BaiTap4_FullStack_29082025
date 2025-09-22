import { useEffect, useState } from 'react';
import { Table, Button, Input, Space, Pagination, notification, Popconfirm, Select } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllProductsApi, deleteProductApi, searchProductsApi } from '../util/api';
import { useNavigate, Link } from 'react-router-dom';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchKeyword, setSearchKeyword] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  // const [promotion, setPromotion] = useState('');
  // const [minViews, setMinViews] = useState('');
  // const [maxViews, setMaxViews] = useState('');
  const categories = [
    { value: 'electronics', label: 'Điện tử' },
    { value: 'clothing', label: 'Quần áo' },
    { value: 'books', label: 'Sách' },
    { value: 'food', label: 'Thực phẩm' },
  ];

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
    try {
      setLoading(true);
      const params = {
        keyword: searchKeyword,
        category: selectedCategory,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        // promotion: promotion !== '' ? promotion : undefined,
        // minViews: minViews ? Number(minViews) : undefined,
        // maxViews: maxViews ? Number(maxViews) : undefined,
        page: 1,
        limit: pagination.pageSize
      };
      const res = await searchProductsApi(params);
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
      title: 'Hình ảnh',
      dataIndex: 'image', // hoặc 'imageUrl' tùy theo dữ liệu
      key: 'image',
      render: (text, record) => (
        <img
          src={record.imageUrl || record.image} // đường dẫn ảnh
          alt={record.name}
          style={{ width: 60, height: 40, objectFit: 'cover' }}
        />
      ),
    },
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
      render: (text, record) => (
        <Link to={`/products/${record._id}`}>{text}</Link>
      ),
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
            style={{ width: 180 }}
          />
          <Select
            placeholder="Danh mục"
            value={selectedCategory}
            onChange={(value) => setSelectedCategory(value)}
            style={{ width: 120 }}
            allowClear
            options={categories}
          />
          <Input
            placeholder="Giá từ"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            style={{ width: 100 }}
          />
          <Input
            placeholder="Giá đến"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={{ width: 100 }}
          />
          {/* <Input
            placeholder="Khuyến mãi (true/false)"
            value={promotion}
            onChange={(e) => setPromotion(e.target.value)}
            style={{ width: 120 }}
          />
          <Input
            placeholder="Lượt xem từ"
            type="number"
            value={minViews}
            onChange={(e) => setMinViews(e.target.value)}
            style={{ width: 100 }}
          />
          <Input
            placeholder="Lượt xem đến"
            type="number"
            value={maxViews}
            onChange={(e) => setMaxViews(e.target.value)}
            style={{ width: 100 }}
          /> */}
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