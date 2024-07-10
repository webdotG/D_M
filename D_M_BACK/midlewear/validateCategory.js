export const validateCategory = (req, res, next) => {
  const { category } = req.query;
  console.log('midlewear category ... : ', category)
  if (!category) {
    return res.status(400).json({ error: 'Категория не указана' });
  }

  req.category = category;
  next();
};