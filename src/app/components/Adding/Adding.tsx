"use client";
import { FiArrowLeft, FiPlus } from 'react-icons/fi';
import { useForm, SubmitHandler } from "react-hook-form";
import type{recipe} from '../../../utls/types/recipe'
import { useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
export default function NewRecipePage() {
  const router = useRouter();
    const [ingredients, setIngredients] = useState([""]);
const [steps, setSteps] = useState([""]);
const addIngredientField = () => {
  setIngredients([...ingredients, ""]);
};

const addStepField = () => {
  setSteps([...steps, ""]);
};
 const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<recipe>({
     
    });
 const onSubmit: SubmitHandler<recipe> = async (data) => {
   const newRecipe = {
  id: data.name + data.time,
  name: data.name,
  image: data.image,
  time: data.time,
  ingredients: data.ingredients.filter(i => i.trim() !== ""),
  steps: data.steps.filter(s => s.trim() !== "")
};
  const response = await fetch('/api/recipes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newRecipe),
  });

  if (!response.ok) {
    toast.error(response.status === 401 ? "Please sign in before saving a recipe." : "Unable to save recipe.");
    return;
  }

  toast.success("Recipe saved successfully!");
    reset();
    setIngredients([""]);
    setSteps([""]);
    router.push(`/added?id=${encodeURIComponent(newRecipe.id)}`);
  
 }

  return (
    <div className="w-full max-w-md mx-auto bg-white min-h-screen flex flex-col justify-between relative pb-28">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href={"/home"}><button className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors">
            <FiArrowLeft className="w-5 h-5" />
          </button></Link>
          <h1 className="text-lg font-bold text-gray-900">Create New Recipe</h1>
          <div className="w-10" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}  className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Recipe Name</label>
            <input 
              type="text" 
              placeholder="e.g. Chocolate Cake" 
              {...register("name")}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#129575]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Image URL</label>
            <input 
              type="url" 
              placeholder="https://images.unsplash.com/..." 
             {...register("image")}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#129575]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Prep Time (e.g., 20 Mins)</label>
            <input 
              type="text" 
              placeholder="20 Mins" 
             {...register("time")}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#129575]"
            />
          </div>

          {/* Ingredients Section */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Ingredients</label>
            {ingredients.map((ing, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input 
                  type="text" 
                  placeholder={`Ingredient ${index + 1}`}
                       {...register(`ingredients.${index}` as const)}

                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#129575]"
                />
              </div>
            ))}
            <button 
              type="button" 
              onClick={addIngredientField}
              className="text-xs text-[#129575] font-semibold hover:underline mt-1 flex items-center gap-1"
            >
              <FiPlus className="w-3.5 h-3.5" /> Add Ingredient
            </button>
          </div>

          {/* Steps Section */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Cooking Steps</label>
            {steps.map((step, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input 
                  type="text" 
                  placeholder={`Step ${index + 1}`}
                 {...register(`steps.${index}` as const)}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#129575]"
                />
              </div>
            ))}
            <button 
              type="button" 
              onClick={addStepField}
              className="text-xs text-[#129575] font-semibold hover:underline mt-1 flex items-center gap-1"
            >
              <FiPlus className="w-3.5 h-3.5" /> Add Step
            </button>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#129575] hover:bg-[#0f7a5f] text-white font-medium py-3 rounded-xl transition-colors shadow-sm mt-4"
          >
            Save Recipe
          </button>
        </form>
      </div>

    </div>
  );
}