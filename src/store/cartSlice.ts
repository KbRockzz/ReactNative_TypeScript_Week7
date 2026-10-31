
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "../types";

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

// Giới hạn số lượng trong khoảng 1 đến tồn kho.
const clamp = (quantity: number, stock: number) =>
  Math.max(1, Math.min(quantity, stock));

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Thêm sách: nếu đã có thì tăng số lượng, nếu chưa thì thêm mới.
    addItem(state, action: PayloadAction<Omit<CartItem, "quantity">>) {
      const book = action.payload;
      const found = state.items.find((item) => item.bookId === book.bookId);

      if (found) {
        found.quantity = clamp(found.quantity + 1, found.stock);
      } else if (book.stock > 0) {
        state.items.push({
          ...book,
          quantity: 1,
        });
      }
    },

    // Xóa một sản phẩm khỏi giỏ.
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (item) => item.bookId !== action.payload
      );
    },

    // Đặt số lượng sản phẩm, không vượt quá tồn kho.
    setQuantity(
      state,
      action: PayloadAction<{ bookId: number; quantity: number }>
    ) {
      const found = state.items.find(
        (item) => item.bookId === action.payload.bookId
      );

      if (found) {
        found.quantity = clamp(action.payload.quantity, found.stock);
      }
    },

    // Xóa toàn bộ giỏ hàng.
    clearCart(state) {
      state.items = [];
    },

    // Giữ lại reducer này để tương thích với chức năng nạp giỏ hàng sau này.
    hydrateCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
  },
});

export const {
  addItem,
  removeItem,
  setQuantity,
  clearCart,
  hydrateCart,
} = cartSlice.actions;

export default cartSlice.reducer;
