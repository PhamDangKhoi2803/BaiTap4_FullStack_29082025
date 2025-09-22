import { CrownOutlined } from '@ant-design/icons';
import { Result } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProductsWithOwnerApi } from '../util/api';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await getAllProductsWithOwnerApi();
    setProducts(Array.isArray(res) ? res : []);
    setLoading(false);
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Tất cả sản phẩm</h2>
      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <ul className="product-list">
          {products.map(product => (
            <li className="product-card" key={product._id}>
              <Link to={`/products/${product._id}`} style={{ textDecoration: "none" }}>
                <img className="product-img" src={product.image} alt={product.name} />
                <div className="product-name">{product.name}</div>
              </Link>
              <div className="product-price">{product.price.toLocaleString()} VNĐ</div>
              <div className="product-meta">
                <span>{product.category}</span>
                <span>Chủ sản phẩm: {product.owner?.name || 'Không rõ'}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomePage;