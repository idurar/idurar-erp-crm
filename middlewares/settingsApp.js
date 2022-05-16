const defaultMenu = require('../helpers').menu;
const CustomMenu = require('../models/CustomMenu');

const tree = (items, id = undefined, link = 'parent', level = 1) => {
  if (level > 5) {
    return [];
  }
  return items
    .filter((item) => item[link] === id)
    .map((item) => {
      item.submenu = tree(items, item._id, link, level++);
      return item;
    });
};

module.exports = (req, res, next) => {
  let menu = defaultMenu;
  CustomMenu.find({ enabled: true }, function (err, result) {
    if (result && result.length > 0) {
      menu = result;
      menu = tree(JSON.parse(JSON.stringify(menu)));
    }
    res.locals.menu = menu;
    next();
  });
};
