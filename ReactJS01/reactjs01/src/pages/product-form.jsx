import { useEffect, useState } from 'react';
import { Form, Input, Button, InputNumber, Select, notification, Card } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { createProductApi, getProductByIdApi, updateProductApi } from '../util/api';

const ProductForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy id từ URL nếu là trang sửa
  const isEditMode = !!id;

  // Danh sách danh mục (có thể lấy từ API trong thực tế)
  const categories = [
    { value: 'electronics', label: 'Điện tử' },
    { value: 'clothing', label: 'Quần áo' },
    { value: 'books', label: 'Sách' },
    { value: 'food', label: 'Thực phẩm' },
  ];

  useEffect(() => {
    if (isEditMode) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const product = await getProductByIdApi(id);
      
      if (product) {
        // Điền thông tin sản phẩm vào form
        form.setFieldsValue({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          image: product.image,
          stock: product.stock
        });
      }
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: error.message || 'Không thể tải thông tin sản phẩm',
      });
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      
      if (isEditMode) {
        // Cập nhật sản phẩm
        await updateProductApi(id, values);
        notification.success({
          message: 'Thành công',
          description: 'Cập nhật sản phẩm thành công!',
        });
      } else {
        // Tạo sản phẩm mới
        await createProductApi(values);
        notification.success({
          message: 'Thành công',
          description: 'Thêm sản phẩm thành công!',
        });
        form.resetFields();
      }
      
      // Quay lại trang danh sách sau khi lưu
      navigate('/products');
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: error.message || `Không thể ${isEditMode ? 'cập nhật' : 'thêm'} sản phẩm`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Card title={isEditMode ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'} style={{ maxWidth: 800, margin: '0 auto' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="Nhập giá sản phẩm"
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
          >
            <Select placeholder="Chọn danh mục" options={categories} />
          </Form.Item>

          <Form.Item
            name="image"
            label="URL hình ảnh"
          >
            <Input placeholder="Nhập URL hình ảnh" />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Số lượng trong kho"
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              placeholder="Nhập số lượng trong kho"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
              {isEditMode ? 'Cập nhật' : 'Thêm mới'}
            </Button>
            <Button onClick={() => navigate('/products')}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProductForm;