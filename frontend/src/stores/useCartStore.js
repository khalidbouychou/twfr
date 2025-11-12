import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],

      // Add single product to cart
      addToCart: (product, amount) => {
        console.log('CartStore - Adding product:', product.id, 'Amount:', amount);
        
        set((state) => {
          const existingItemIndex = state.cartItems.findIndex(item => item.id === product.id);
          
          if (existingItemIndex >= 0) {
            // Update existing item
            const updatedCart = [...state.cartItems];
            updatedCart[existingItemIndex] = {
              ...updatedCart[existingItemIndex],
              amount: parseFloat(updatedCart[existingItemIndex].amount) + parseFloat(amount)
            };
            console.log('CartStore - Updated existing item. New cart:', updatedCart);
            return { cartItems: updatedCart };
          } else {
            // Add new item
            const newCart = [...state.cartItems, {
              ...product,
              amount: parseFloat(amount),
              addedAt: new Date().toISOString()
            }];
            console.log('CartStore - Added new item. New cart:', newCart);
            return { cartItems: newCart };
          }
        });
      },

      // Add multiple products to cart
      addMultipleToCart: (productsArray) => {
        console.log('CartStore - Adding multiple products:', productsArray);
        
        set((state) => {
          let updatedCart = [...state.cartItems];
          
          productsArray.forEach(({ product, amount }) => {
            const existingItemIndex = updatedCart.findIndex(item => item.id === product.id);
            
            if (existingItemIndex >= 0) {
              updatedCart[existingItemIndex] = {
                ...updatedCart[existingItemIndex],
                amount: parseFloat(updatedCart[existingItemIndex].amount) + parseFloat(amount)
              };
            } else {
              updatedCart.push({
                ...product,
                amount: parseFloat(amount),
                addedAt: new Date().toISOString()
              });
            }
          });
          
          console.log('CartStore - Final cart after adding multiple:', updatedCart);
          return { cartItems: updatedCart };
        });
      },

      // Remove product from cart
      removeFromCart: (productId) => {
        set((state) => ({
          cartItems: state.cartItems.filter(item => item.id !== productId)
        }));
      },

      // Update cart item amount
      updateCartItemAmount: (productId, newAmount) => {
        set((state) => ({
          cartItems: state.cartItems.map(item => 
            item.id === productId 
              ? { ...item, amount: parseFloat(newAmount) }
              : item
          )
        }));
      },

      // Clear entire cart
      clearCart: () => {
        set({ cartItems: [] });
      },

      // Get cart total
      getCartTotal: () => {
        const state = get();
        return state.cartItems.reduce((total, item) => total + (item.amount || 0), 0);
      },

      // Get cart count
      getCartCount: () => {
        const state = get();
        return state.cartItems.length;
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
