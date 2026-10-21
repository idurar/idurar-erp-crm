const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  name: { type: String, required: true, trim: true, unique: true },
  parent: { type: mongoose.Schema.ObjectId, ref: 'ArticleCategory', default: null },
  description: { type: String, trim: true },
  color: { type: String, default: '#1677ff' },
  trackStock: { type: Boolean, default: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

const validateParent = async (Model, categoryId, parentId) => {
  if (!parentId) return;
  const ownId = String(categoryId || '');
  const visited = new Set();
  let currentId = String(parentId);

  while (currentId) {
    if (currentId === ownId || visited.has(currentId)) {
      throw new Error('Eine Kategorie kann nicht sich selbst oder einer Unterkategorie zugeordnet werden.');
    }
    visited.add(currentId);
    const parent = await Model.findOne({ _id: currentId, removed: false }).select('parent').lean();
    if (!parent) throw new Error('Die ausgewählte Überkategorie existiert nicht.');
    currentId = parent.parent ? String(parent.parent) : '';
  }
};

schema.pre('save', async function () {
  await validateParent(this.constructor, this._id, this.parent);
});

schema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate();
  if (!Object.prototype.hasOwnProperty.call(update, 'parent')) return;
  await validateParent(this.model, this.getQuery()._id, update.parent);
});

module.exports = mongoose.model('ArticleCategory', schema);
