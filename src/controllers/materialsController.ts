import { Request, Response, RequestHandler, NextFunction } from "express";
import { pool } from "../config/db";
import { AppError } from "../utils/AppError";
import {
  getMaterialListQuery,
  getMaterialTypesQuery,
  getMaterialsByTypeQuery,
  getCategoriesByTypeQuery,
  getCategoryMaterialsQuery,
  getCategoryWithSubcategoriesMaterialsQuery,
} from "../queries/materialQueries";
import {
  organizeCategories,
  organizeMaterialsAndCategories,
} from "../services/categoryService";

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

    const organizedCategories = organizeCategories(result.rows);

    res.status(200).json(organizedCategories);
  } catch (error) {
    // Pass all other errors to errorMiddleware for centralized handling
    next(error);
  }
};

export const getMaterialsByCategory: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { categoryId } = req.params;
  const includeSubcategories = req.query.includeSubcategories === "true";

  try {
    if (!categoryId || isNaN(Number(categoryId))) {
      return next(new AppError("ERR_MISSING_FIELDS", 400));
    }

    const query = includeSubcategories
      ? getCategoryWithSubcategoriesMaterialsQuery
      : getCategoryMaterialsQuery;

    const result = await pool.query(query, [categoryId]);

    const organizedData = organizeMaterialsAndCategories(result.rows);

    res.status(200).json(organizedData);
  } catch (error) {
    // Pass all other errors to errorMiddleware for centralized handling
    next(error);
  }
};
