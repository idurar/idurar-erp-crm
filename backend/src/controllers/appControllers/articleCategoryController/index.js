const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const { getCategoryUsage } = require('@/services/articleCategoryService');

const Article = mongoose.model('Article');
const ArticleCategory = mongoose.model('ArticleCategory');
const base = createCRUDController('ArticleCategory');

const remove = async (req, res) => {
  const category = await ArticleCategory.findOne({ _id: req.params.id, removed: false });
  if (!category) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Kategorie nicht gefunden.',
    });
  }

  const usage = await getCategoryUsage(category._id, { Article, ArticleCategory });
  if (usage.articleCount || usage.childCount) {
    return res.status(409).json({
      success: false,
      result: usage,
      message: 'Die Kategorie kann erst gelöscht werden, wenn alle Artikel und Unterkategorien neu zugeordnet wurden.',
    });
  }

  category.removed = true;
  category.updated = new Date();
  await category.save();
  return res.status(200).json({
    success: true,
    result: category,
    message: 'Kategorie wurde gelöscht.',
  });
};

module.exports = { ...base, remove };
