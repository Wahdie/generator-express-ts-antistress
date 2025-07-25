export async function validateCreateUniqueFields(
  payload: Record<string, any>,
  model: any
): Promise<void> {
  for (const field of Object.keys(payload)) {
    const value = payload[field];
    if (!value) continue;
    const exists = await model.findOne({ where: { [field]: value } });  

    if (exists) {
      const error = new Error(`${field} must be unique`) as any;
      error.statusCode = 400;
      throw error;
    }
  }
}

export async function validateUpdateUniqueFields(
  id: number,
  payload: any,
  model: any
): Promise<void> {
  for (const field of Object.keys(payload)) {
    const value = payload[field];
    if (!value) continue;
    const exists = await model.findOne({where: {[field]: value}});
    if (exists && exists.id !== id) {
      const error = new Error(`${field} must be unique`) as any;
      error.statusCode = 400;
      throw error;
    };
  }
}