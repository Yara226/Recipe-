import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
export interface CategoryItem {
  idCategory: string;
  strCategory: string;
  strCategoryThumb:string
}
export interface CategoryState {
  categories: CategoryItem[];
  loading: boolean;
  error: string | null;
}
const initialState: CategoryState = {
categories: [],
loading: false,
  error: null,
};
export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async () => {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
    const data = await response.json();
    return data.categories; // ده بيمثل مصفوفة التصنيفات
  }
);
export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<CategoryItem[]>) => {
        state.loading = false;
        state.categories = action.payload; // حفظ التصنيفات في الـ Redux
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      });
  },
});

export default categorySlice.reducer;