import { Request, Response, RequestHandler, NextFunction } from "express";
import { pool } from "../config/db";
import { AppError } from "../utils/AppError";
import {
  getMaterialListQuery,
  getMaterialTypesQuery,
  getMaterialsByTypeQuery,
  getCategoriesByTypeQuery,
} from "../queries/materialQueries";

interface Category {
  id: number;
  type_id: number;
  parent_id?: number | null;
  name: string;
}

interface ParentCategory extends Category {
  categories: ParentCategory[];
}

export const getMaterialList: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await pool.query(getMaterialListQuery);
    res.status(200).json({ data: result.rows, count: result.rowCount });
  } catch (error) {
    // Pass all other errors to errorMiddleware for centralized handling
    next(error);
  }
};

export const getMaterialTypes: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await pool.query(getMaterialTypesQuery);
    res.status(200).json(result.rows);
  } catch (error) {
    // Pass all other errors to errorMiddleware for centralized handling
    next(error);
  }
};

export const getMaterialsByType: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { materialTypeId } = req.params;

  try {
    if (!materialTypeId || isNaN(Number(materialTypeId))) {
      return next(new AppError("ERR_MISSING_FIELDS", 400));
    }

    const result = await pool.query(getMaterialsByTypeQuery, [materialTypeId]);
    res.status(200).json({ data: result.rows, count: result.rowCount });
  } catch (error) {
    // Pass all other errors to errorMiddleware for centralized handling
    next(error);
  }
};

export const getCategoriesByType: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { materialTypeId } = req.params;

  try {
    if (!materialTypeId || isNaN(Number(materialTypeId))) {
      return next(new AppError("ERR_MISSING_FIELDS", 400));
    }

    const result = await pool.query(getCategoriesByTypeQuery, [materialTypeId]);

    const organizeCategories = (categories: Category[]): ParentCategory[] => {
      const categoryMap = new Map<number, ParentCategory>();

      categories.forEach((cat: Category) => {
        categoryMap.set(cat.id, { ...cat, categories: [] });
      });

      categories.forEach((cat) => {
        if (cat.parent_id && categoryMap.has(cat.parent_id)) {
          categoryMap
            .get(cat.parent_id)
            ?.categories.push(categoryMap.get(cat.id)!);
        }
      });

      return [...categoryMap.values()].filter((cat) => !cat.parent_id);
    };

    const organizedCategories = organizeCategories(result.rows);

    res.status(200).json(organizedCategories);
  } catch (error) {
    // Pass all other errors to errorMiddleware for centralized handling
    next(error);
  }
};
