export const VALID_SORT_BY = ["created_at", "updated_at", "name"];
export const VALID_SORT_ORDER = ["asc", "desc"];
export const DEFAULT_SORT_BY = "created_at";
export const DEFAULT_SORT_ORDER = "desc";

// 從 req.query 中傳入的排序參數可能為任意值，此函式會檢查其合法性。
// 不合法時使用預設值，並返回 { sortBy, sortOrder }（均為字串）。
export function parseSortParams(sortByInput: any, sortOrderInput: any) {
  let sortBy = String(sortByInput || DEFAULT_SORT_BY);
  let sortOrder = String(sortOrderInput || DEFAULT_SORT_ORDER).toLowerCase();

  // 檢查輸入值是否合法
  if (!VALID_SORT_BY.includes(sortBy)) {
    sortBy = DEFAULT_SORT_BY;
  }
  if (!VALID_SORT_ORDER.includes(sortOrder)) {
    sortOrder = DEFAULT_SORT_ORDER;
  }
  return { sortBy, sortOrder };
}
