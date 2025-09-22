import { useState, useEffect, useContext } from "react";
import { getFavoriteProductsApi, favoriteProductApi } from "../util/api";
import { AuthContext } from "../components/context/auth.context";

const FavoriteTab = () => {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user._id) fetchFavorites();
    // eslint-disable-next-line
  }, [user]);

  const fetchFavorites = async () => {
    setLoading(true);
    const res = await getFavoriteProductsApi();
    const data = Array.isArray(res) ? res : [res];
    setFavorites(data.filter(product => product && product.image));
    setLoading(false);
  };

  const handleUnfavorite = async (id) => {
    setLoading(true);
    await favoriteProductApi(id);
    fetchFavorites();
  };

  return (
    <div className="page-container">
      <h3 className="page-title">Sản phẩm yêu thích</h3>
      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : favorites.length === 0 ? (
        <p className="empty-text">Chưa có sản phẩm yêu thích.</p>
      ) : (
        <ul className="product-list">
          {favorites.map(product => (
            <li className="product-card" key={product._id}>
              <img className="product-img" src={product.image} alt={product.name} />
              <div className="product-name">{product.name}</div>
              <div className="product-price">{product.price.toLocaleString()} VNĐ</div>
              <button className="btn-unfavorite" onClick={() => handleUnfavorite(product._id)}>
                Bỏ yêu thích
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoriteTab;