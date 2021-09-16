const { ObjectId } = require("mongodb");
const { createHash } = require("crypto");

// Returns a predictable ObjectId based on input name
const getObjectId = (name) => {
  const hash = createHash("sha1").update(name, "utf8").digest("hex");

  return new ObjectId(hash.substring(0, 24));
};

const getObjectIds = (names) => {
  return names.map((name) => getObjectId(name));
};

const mapToEntities = (names) => {
  return names.map((name) => {
    const id = getObjectId(name);

    return {
      id,
      name,
    };
  });
};

module.exports = {
  mapToEntities,
  getObjectId,
  getObjectIds,
};
