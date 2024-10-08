import { useState, useEffect, useCallback } from 'react';
import { CategoryData, fetchCategories } from '@/api/api';

export function useCategoryData(profileId: string) {
  const [categoryData, setCategoryData] = useState<CategoryData[] | null>(null);

  const refreshCategoryData = useCallback(() => {
    if (!profileId) {
      setCategoryData(null);
      return;
    }
    Promise.all([ fetchCategories(profileId) ]).then(([categories]) => {
      setCategoryData(categories);
    });
  }, [profileId]);
  
  useEffect(() => {
    refreshCategoryData();
  }, [refreshCategoryData]);

  return { categoryData, refreshCategoryData };
}