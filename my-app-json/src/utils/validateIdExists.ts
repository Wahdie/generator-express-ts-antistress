export async function validateIdExists(model: any, id: any, name = 'Data') {
 
  const data = await model.findByPk(id);  

  if (!data) {
    const error = new Error(`${name} not found`) as any;
    error.statusCode = 404;
    throw error;
  }
  return data;
}