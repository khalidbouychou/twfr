import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('investmentCart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart:', error);
      return [];
    }
  });

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('investmentCart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, [cartItems]);

  const addToCart = (product, amount) => {
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        amount: parseFloat(updatedCart[existingItemIndex].amount) + parseFloat(amount)
      };
      setCartItems(updatedCart);
    } else {
      // Add new item
      const newCart = [...cartItems, {
        ...product,
        amount: parseFloat(amount),
        addedAt: new Date().toISOString()
      }];
      setCartItems(newCart);
    }
  };

  // Add multiple products to cart in a single state update
  const addMultipleToCart = (productsArray) => {
    setCartItems(prevCart => {
      let updatedCart = [...prevCart];
      
      productsArray.forEach(({ product, amount }) => {
        const existingItemIndex = updatedCart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex >= 0) {
          // Update existing item
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            amount: parseFloat(updatedCart[existingItemIndex].amount) + parseFloat(amount)
          };
        } else {
          // Add new item
          updatedCart.push({
            ...product,
            amount: parseFloat(amount),
            addedAt: new Date().toISOString()
          });
        }
      });
            return updatedCart;
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const updateCartItemAmount = (productId, newAmount) => {
    setCartItems(cartItems.map(item => 
      item.id === productId 
        ? { ...item, amount: parseFloat(newAmount) }
        : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + parseFloat(item.amount || 0), 0);
  };

  const getCartCount = () => {
    return cartItems.length;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      addMultipleToCart,
      removeFromCart,
      updateCartItemAmount,
      clearCart,
      getTotalAmount,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
