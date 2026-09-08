import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchCategories } from '../cateogries/categorySlice';
export interface mealItem {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  strArea?: string;
  strCategory?: string;
  // المكونات والكميات بتكون Strings منفصلة في الـ API
  [key: `strIngredient${number}`]: string | null | undefined;
  [key: `strMeasure${number}`]: string | null | undefined;
}
export interface ItemState {
  meals: mealItem[];
  loading: boolean;
  error: string | null;
}
const initialState: ItemState = {
meals: [],
loading: false,
  error: null,
};
export const fetchMeals = createAsyncThunk(
  'meal/fetchMeals',
  async (mealId: string) => {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const data = await response.json();
    return data.meals; // ده بيمثل مصفوفة التصنيفات
  }
);
export const MealSlice = createSlice({
  name: 'meal',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMeals.fulfilled, (state, action: PayloadAction<mealItem[]>) => {
        state.loading = false;
        state.meals = action.payload; // حفظ التصنيفات في الـ Redux
      })
      .addCase(fetchMeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch meals';
      });
  },
});

export default MealSlice.reducer;