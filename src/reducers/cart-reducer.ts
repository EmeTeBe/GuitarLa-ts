import { db } from "../data/db";
import type { CartItem, Guitar } from "../types";

export type CartActions =
  | { type: "add-to-cart"; payload: { item: Guitar } }
  | { type: "remove-from-cart"; payload: { id: Guitar["id"] } }
  | { type: "decrease-quantity"; payload: { id: Guitar["id"] } }
  | { type: "increase-quantity"; payload: { id: Guitar["id"] } }
  | { type: "clear-cart" };

export type CartState = {
  data: Guitar[];
  cart: CartItem[];
};

const initialCart = (): CartItem[] => {
  const localStorageCart = localStorage.getItem("cart");
  return localStorageCart ? JSON.parse(localStorageCart) : [];
};

export const initialState: CartState = {
  data: db,
  cart: initialCart(),
};

const MAX_QUANTITY = 5;
const MIN_QUANTITY = 1;

export const cartReducer = (
  state: CartState = initialState,
  action: CartActions
) => {
  if (action.type === "add-to-cart") {
    const existingItem = state.cart.find(
      (cartItem) => cartItem.id === action.payload.item.id
    );
    let updatedCart: CartItem[] = [];
    if (existingItem) {
      updatedCart = state.cart.map((item) => {
        if (item.id === action.payload.item.id) {
          if (item.quantity < MAX_QUANTITY) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        } else {
          return item;
        }
      });
    } else {
      updatedCart = [...state.cart, { ...action.payload.item, quantity: 1 }];
    }
    return {
      ...state,
      cart: updatedCart,
    };
  }

  if (action.type === "remove-from-cart") {
    const updatedCart = state.cart.filter(
      (item) => item.id !== action.payload.id
    );
    return {
      ...state,
      cart: updatedCart,
    };
  }

  if (action.type === "decrease-quantity") {
    const updatedCart = state.cart.map((item) => {
      if (item.id === action.payload.id && item.quantity > MIN_QUANTITY) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });
    return {
      ...state,
      cart: updatedCart,
    };
  }

  if (action.type === "increase-quantity") {
    const updateCart = state.cart.map((item) => {
      if (item.id === action.payload.id && item.quantity < MAX_QUANTITY) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
    return {
      ...state,
      cart: updateCart,
    };
  }

  if (action.type === "clear-cart") {
    const updatedCart: CartItem[] = [];
    return {
      ...state,
      cart: updatedCart,
    };
  }
  return state;
};
