import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiGrid, FiList } from 'react-icons/fi';
import ProductCard from '../../components/Products/ProductCard';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');
  const search = searchParams.get('search');

  // Fetch products with simple fetch
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (subcategory) params.append('subcategory', subcategory);
        if (search) params.append('search', search);
        
        const url = `http://localhost:5000/api/products?${params.toString()}`;
        console.log('Fetching from:', url);
        
        const response = await fetch(url);
        const data = await response.json();
        
        console.log('API Response:', data);
        
        if (data.success) {
          setProducts(data.data.products || []);
        } else {
          setError('Failed to fetch products');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, subcategory, search]);

  const handleFilterChange = (filterType, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(filterType, value);
    } else {
      newParams.delete(filterType);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="container"><p>Error: {error}</p></div>;

  const total = products.length;

  return (
    <div className="products-page">
      <div className="container">
        {/* Header */}
        <div className="products-header">
          <div className="header-left">
            <h1>Products</h1>
            <p>{total} products found</p>
          </div>
          <div className="header-right">
            <div className="view-controls">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <FiGrid />
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <FiList />
              </button>
            </div>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="products-content">
          {/* Filters Sidebar */}
          <div className="filters-sidebar">
            <div className="filter-section">
              <h3>Categories</h3>
              <div className="filter-options">
                <label>
                  <input 
                    type="radio" 
                    name="category" 
                    checked={!category}
                    onChange={() => handleFilterChange('category', '')}
                  />
                  All Categories
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="category" 
                    checked={category === 'electronics'}
                    onChange={() => handleFilterChange('category', 'electronics')}
                  />
                  Electronics
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="category" 
                    checked={category === 'fashion'}
                    onChange={() => handleFilterChange('category', 'fashion')}
                  />
                  Fashion
                </label>
              </div>
            </div>

            {category === 'electronics' && (
              <div className="filter-section">
                <h3>Electronics</h3>
                <div className="filter-options">
                  <label>
                    <input 
                      type="radio" 
                      name="subcategory" 
                      checked={!subcategory}
                      onChange={() => handleFilterChange('subcategory', '')}
                    />
                    All Electronics
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="subcategory" 
                      checked={subcategory === 'mobiles'}
                      onChange={() => handleFilterChange('subcategory', 'mobiles')}
                    />
                    Mobiles
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="subcategory" 
                      checked={subcategory === 'laptops'}
                      onChange={() => handleFilterChange('subcategory', 'laptops')}
                    />
                    Laptops
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="subcategory" 
                      checked={subcategory === 'audio'}
                      onChange={() => handleFilterChange('subcategory', 'audio')}
                    />
                    Audio
                  </label>
                </div>
              </div>
            )}

            {category === 'fashion' && (
              <div className="filter-section">
                <h3>Fashion</h3>
                <div className="filter-options">
                  <label>
                    <input 
                      type="radio" 
                      name="subcategory" 
                      checked={!subcategory}
                      onChange={() => handleFilterChange('subcategory', '')}
                    />
                    All Fashion
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="subcategory" 
                      checked={subcategory === 'mens'}
                      onChange={() => handleFilterChange('subcategory', 'mens')}
                    />
                    Men's Wear
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="subcategory" 
                      checked={subcategory === 'womens'}
                      onChange={() => handleFilterChange('subcategory', 'womens')}
                    />
                    Women's Wear
                  </label>
                </div>
              </div>
            )}

            {(category || subcategory) && (
              <button className="btn btn-secondary" onClick={clearFilters}>
                Clear Filters
              </button>
            )}
          </div>

          {/* Products Grid */}
          <div className="products-main">
            {products.length === 0 ? (
              <div className="no-products">
                <p>No products found matching your criteria.</p>
              </div>
            ) : (
              <div className={`products-grid ${viewMode}`}>
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
