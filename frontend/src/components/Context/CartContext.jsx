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
    console.log('CartContext - Adding product:', product.id, 'Amount:', amount);
    console.log('CartContext - Current cart items:', cartItems);
    
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    
    console.log('CartContext - Existing item index:', existingItemIndex);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        amount: parseFloat(updatedCart[existingItemIndex].amount) + parseFloat(amount)
      };
      console.log('CartContext - Updated existing item. New cart:', updatedCart);
      setCartItems(updatedCart);
    } else {
      // Add new item
      const newCart = [...cartItems, {
        ...product,
        amount: parseFloat(amount),
        addedAt: new Date().toISOString()
      }];
      console.log('CartContext - Added new item. New cart:', newCart);
      setCartItems(newCart);
    }
  };

  // Add multiple products to cart in a single state update
  const addMultipleToCart = (productsArray) => {
    console.log('CartContext - Adding multiple products:', productsArray);
    console.log('CartContext - Current cart items:', cartItems);
    
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
      
      console.log('CartContext - Final cart after adding multiple:', updatedCart);
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
