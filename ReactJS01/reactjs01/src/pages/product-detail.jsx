import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '../components/context/auth.context';
import {
  favoriteProductApi,
  viewProductApi,
  buyProductApi,
  getSimilarProductsApi,
  getProductCommentsCountApi,
  getProductByIdApi
} from '../util/api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState({});
  const [similar, setSimilar] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const hasViewed = useRef(false);

  useEffect(() => {
    if (user && !hasViewed.current && !product.views?.includes(user._id)) {
      viewProductApi(id);
      hasViewed.current = true;
    }
    // eslint-disable-next-line
  }, [id, user._id]);

  useEffect(() => {
    fetchProduct();
    fetchSimilar();
    fetchCommentsCount();
    // eslint-disable-next-line
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    const res = await getProductByIdApi(id);
    setProduct(res);
    setLoading(false);
  };

  const fetchSimilar = async () => {
    const res = await getSimilarProductsApi(id);
    setSimilar(res);
  };

  const fetchCommentsCount = async () => {
    const res = await getProductCommentsCountApi(id);
    setCommentsCount(res.commentsCount);
  };

  const handleFavorite = async () => {
    if (!user) return navigate('/login');
    await favoriteProductApi(id);
    fetchProduct();
  };

  const handleBuy = async () => {
    if (!user) return navigate('/login');
    await buyProductApi(id);
    fetchProduct();
  };

  const isFavorite = user && product.favorites?.includes(user._id);
  const isBuyer = user && product.buyers?.includes(user._id);

  return (
    <div className="page-container">
      {loading || !product || !product.name ? (
        <div className="loading">Đang tải sản phẩm...</div>
      ) : (
        <>
          <div className="product-detail-header" style={{ justifyContent: "center" }}>
            <div className="product-title-box">
              <div className="page-title">{product.name}</div>
              {product.image && (
                <img className="product-detail-img" src={product.image} alt={product.name} />
              )}
              <p className="product-desc">{product.description}</p>
              <div className="product-price" style={{ fontSize: "1.3rem", margin: "16px 0" }}>
                {product.price.toLocaleString()} VNĐ
              </div>
              <div className="product-actions">
                <button
                  className="btn-favorite"
                  onClick={handleFavorite}
                >
                  {isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
                </button>
                <button
                  className="btn-buy"
                  onClick={handleBuy}
                  disabled={isBuyer}
                >
                  {isBuyer ? 'Đã mua' : 'Mua sản phẩm'}
                </button>
              </div>
              <div className="product-meta">
                <span>Đã xem: {product.views?.length || 0}</span>
                <span>Khách mua: {product.buyers?.length || 0}</span>
                <span>Bình luận: {commentsCount}</span>
              </div>
            </div>
          </div>
          <h3 className="page-title" style={{ fontSize: "1.3rem", marginTop: "32px" }}>Sản phẩm tương tự</h3>
          <ul className="product-list">
            {similar.map(s => (
              <li className="product-card" key={s._id}>
                {s.image && <img className="product-img" src={s.image} alt={s.name} />}
                <div className="product-name">{s.name}</div>
                <div className="product-price">{s.price.toLocaleString()} VNĐ</div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}