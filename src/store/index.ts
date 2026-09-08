
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // بيستخدم Local Storage افتراضياً

import categoryReducer from './features/cateogries/categorySlice';
import ItemReducer from './features/recipes/recipeSlice';
import MealsReducer from './features/meal/mealSlice';

// 1. تجميع الـ Reducers في الجذر (Root Reducer)
const rootReducer = combineReducers({
  category: categoryReducer,
  items: ItemReducer,
  meals: MealsReducer,
});

// 2. إعدادات الـ Persist (هنا بنحدد إيه اللي هيتخزن)
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['items', 'meals'], // السلايدز اللي حابة تحفظيها بس (مثلاً الوصفات والوجبات)
  // blacklist: ['category'] // لو في حاجات مش حابة تخزنيها تقدري تحطيها هنا
};

// 3. دمج الإعدادات مع الـ Root Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. إنشاء الـ Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // السطر ده ضروري عشان نتجنب تحذيرات الـ Serialized data في Redux Toolkit مع الـ Persist
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// 5. إنشاء الـ Persistor اللي هنربطه بملف الـ Root
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;