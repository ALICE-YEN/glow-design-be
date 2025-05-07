export interface UpdateDesignData {
  name?: string;
  description?: string;
  data?: any;
}

export interface GeneratedQuery {
  updateDesignQuery: string;
  values: any[];
}

// 根據傳入的 updateData 與 designId 動態生成更新 SQL 語句和參數陣列。
// 只會更新傳入值不為 undefined 的欄位，並固定更新 updated_at 欄位。
export function generateUpdateDesignQuery(
  updateData: UpdateDesignData,
  designId: number
): GeneratedQuery {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (updateData.name !== undefined) {
    fields.push(`name = $${paramIndex}`);
    values.push(updateData.name);
    paramIndex++;
  }
  if (updateData.description !== undefined) {
    fields.push(`description = $${paramIndex}`);
    values.push(updateData.description);
    paramIndex++;
  }
  if (updateData.data !== undefined) {
    fields.push(`data = $${paramIndex}`);
    values.push(updateData.data);
    paramIndex++;
  }

  // 自動更新 updated_at
  fields.push(`updated_at = NOW()`);

  // 組合完整查詢語句
  const updateDesignQuery = `
  UPDATE designs
  SET ${fields.join(", ")}
  WHERE id = $${paramIndex}
  RETURNING id, name, description, data, created_by, created_at, updated_at;
  `;

  // designId 放在最後
  values.push(designId);

  return { updateDesignQuery, values };
}
