async function getCategoryUsage(categoryId, { Article, ArticleCategory }) {
  const [articleCount, childCount] = await Promise.all([
    Article.countDocuments({ category: categoryId, removed: false }),
    ArticleCategory.countDocuments({ parent: categoryId, removed: false }),
  ]);

  return { articleCount, childCount };
}

module.exports = { getCategoryUsage };
