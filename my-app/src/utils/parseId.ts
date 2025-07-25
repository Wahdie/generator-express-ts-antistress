export const parseId = (id: any) => {
  if (!id) throw new Error('ID is required');
  
  const parsed = Number(id);
  if (isNaN(parsed)) throw new Error('ID must be a number');
  return parsed;
  

};