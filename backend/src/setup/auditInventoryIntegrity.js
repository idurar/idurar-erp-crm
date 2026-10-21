require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const mongoose = require('mongoose');
const Article = require('../models/appModels/Article');
const ArticleCategory = require('../models/appModels/ArticleCategory');
const StockMovement = require('../models/appModels/StockMovement');

const STOCK_TOLERANCE = 0.000001;

async function auditInventoryIntegrity() {
  await mongoose.connect(process.env.DATABASE);

  const articles = await Article.find({ removed: false }).select('stock category').lean();
  const movementTotals = await StockMovement.aggregate([
    { $match: { removed: false } },
    { $group: { _id: '$article', total: { $sum: '$quantity' } } },
  ]);
  const stockByArticle = new Map(
    movementTotals.map(({ _id, total }) => [String(_id), total])
  );

  const categoryIds = new Set(
    (await ArticleCategory.find({ removed: false }).distinct('_id')).map(String)
  );
  const categories = await ArticleCategory.find({ removed: false }).select('parent').lean();

  return {
    articles: articles.length,
    stockMismatches: articles.filter(
      (article) =>
        Math.abs((article.stock || 0) - (stockByArticle.get(String(article._id)) || 0)) >
        STOCK_TOLERANCE
    ).length,
    orphanArticleCategories: articles.filter(
      (article) => article.category && !categoryIds.has(String(article.category))
    ).length,
    orphanCategoryParents: categories.filter(
      (category) => category.parent && !categoryIds.has(String(category.parent))
    ).length,
  };
}

if (require.main === module) {
  auditInventoryIntegrity()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
      const hasIntegrityErrors = Object.entries(result).some(
        ([key, value]) => key !== 'articles' && value > 0
      );
      process.exitCode = hasIntegrityErrors ? 1 : 0;
    })
    .catch((error) => {
      console.error(`Inventory integrity audit failed: ${error.message}`);
      process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
}

module.exports = auditInventoryIntegrity;
