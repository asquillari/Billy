import { useState, useEffect } from 'react';
import { CategoryData, fetchCategories } from '@/api/api';

export function useCategoryData() {
  const [categoryData, setCategoryData] = useState<CategoryData[] | null>(null);

  const refreshCategoryData = async () => {
    try {
      const data = await fetchCategories("f5267f06-d68b-4185-a911-19f44b4dc216");
      setCategoryData(data);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  useEffect(() => {
    refreshCategoryData();
  }, []);

  return { categoryData, refreshCategoryData };
}