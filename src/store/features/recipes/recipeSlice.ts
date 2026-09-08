import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface item {
  strMeal: string;
  strMealThumb: string;
  idMeal: number;
  strCountry: string;
}

export interface ItemsState {
  items: item[];
  loading: boolean;
  error: string | null;
}

const initialState: ItemsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchItems = createAsyncThunk<item[], string>(
  'items/fetchItems',
  async (categryName: string) => {
    console.log('Category Name sent to API:', categryName);
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categryName}`);
    const data = await response.json();
    console.log('data', data);
    return Array.isArray(data.meals) ? data.meals : [];
  }
);
export const ItemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action: PayloadAction<item[]>) => {
        state.loading = false;
        state.items = action.payload; // حفظ التصنيفات في الـ Redux
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      });
  },
});

export default ItemsSlice.reducer;