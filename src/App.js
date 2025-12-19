import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Layout from './components/Layout/Layout';
import LoadingSpinner from './components/UI/LoadingSpinner';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminRoute from './components/Auth/AdminRoute';
import ScrollToTop from './components/UI/ScrollToTop';
import ErrorBoundary from './components/UI/ErrorBoundary';

// Lazy load components for better performance
const Home = lazy(() => import('./pages/Home/Home'));
const Products = lazy(() => import('./pages/Products/Products'));
const ProductDetail = lazy(() => import('./pages/Products/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart/Cart'));
const Checkout = lazy(() => import('./pages/Checkout/Checkout'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const Orders = lazy(() => import('./pages/Orders/Orders'));
const OrderDetail = lazy(() => import('./pages/Orders/OrderDetail'));
const Wishlist = lazy(() => import('./pages/Wishlist/Wishlist'));
const Search = lazy(() => import('./pages/Search/Search'));
const About = lazy(() => import('./pages/About/About'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const FAQ = lazy(() => import('./pages/FAQ/FAQ'));
const PrivacyPolicy = lazy(() => import('./pages/Legal/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/Legal/TermsOfService'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/Admin/Products'));
const AdminOrders = lazy(() => import('./pages/Admin/Orders'));
const AdminUsers = lazy(() => import('./pages/Admin/Users'));
const AdminAnalytics = lazy(() => import('./pages/Admin/Analytics'));

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <ScrollToTop />
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Layout />}>
              <Route 
                index 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Home />
                  </Suspense>
                } 
              />
              
              <Route 
                path="products" 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Products />
                  </Suspense>
                } 
              />
              
              <Route 
                path="products/:id" 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ProductDetail />
                  </Suspense>
                } 
              />
              
              <Route 
                path="cart" 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Cart />
                  </Suspense>
                } 
              />
              
              <Route 
                path="search" 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Search />
                  </Suspense>
                } 
              />
              
              <Route 
                path="about" 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <About />
                  </Suspense>
                } 
              />
              
              <Route 
                path="contact" 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Contact />
                  </Suspense>
                } 
              />
              
              <Route 
                path="faq" 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <FAQ />
                  </Suspense>
                } 
              />
              
              <Route 
                path="privacy" 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <PrivacyPolicy />
                  </Suspense>
                } 
              />
              
              <Route 
                path="terms" 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <TermsOfService />
                  </Suspense>
                } 
              />
            </Route>

            {/* Auth routes */}
            <Route 
              path="/login" 
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Login />
                </Suspense>
              } 
            />
            
            <Route 
              path="/register" 
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Register />
                </Suspense>
              } 
            />

            {/* Protected routes */}
            <Route path="/" element={<Layout />}>
              <Route 
                path="checkout" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Checkout />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="profile" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Profile />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="orders" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Orders />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="orders/:id" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <OrderDetail />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="wishlist" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Wishlist />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={<Layout isAdmin />}>
              <Route 
                index 
                element={
                  <AdminRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminDashboard />
                    </Suspense>
                  </AdminRoute>
                } 
              />
              
              <Route 
                path="products" 
                element={
                  <AdminRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminProducts />
                    </Suspense>
                  </AdminRoute>
                } 
              />
              
              <Route 
                path="orders" 
                element={
                  <AdminRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminOrders />
                    </Suspense>
                  </AdminRoute>
                } 
              />
              
              <Route 
                path="users" 
                element={
                  <AdminRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminUsers />
                    </Suspense>
                  </AdminRoute>
                } 
              />
              
              <Route 
                path="analytics" 
                element={
                  <AdminRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminAnalytics />
                    </Suspense>
                  </AdminRoute>
                } 
              />
            </Route>

            {/* Catch all route */}
            <Route 
              path="*" 
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <NotFound />
                </Suspense>
              } 
            />
          </Routes>
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}

export default App;