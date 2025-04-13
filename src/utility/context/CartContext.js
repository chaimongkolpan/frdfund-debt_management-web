import { createContext, useState, useContext, useCallback } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [numberCart, setNumberCart] = useState(0);

  const updateCartNumber = useCallback((newNumber) => {
    setNumberCart(newNumber);
  }, []);

  return (
    <CartContext.Provider value={{ numberCart, updateCartNumber }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
