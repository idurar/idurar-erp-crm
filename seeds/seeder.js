require("dotenv").config({ path: ".variables.env" });

const { Seeder } = require("mongo-seeding");
const path = require("path");

const config = {
  database: process.env.DATABASE,
  dropDatabase: false,
  upsert: true,
};

const seed = () => {
  const seeder = new Seeder(config);
  console.log(seeder);
  const collcetions = seeder.readCollectionsFromPath(path.resolve("seeds/"), {
    extensions: ["ts", "js", "json"],
    transformers: [Seeder.Transformers.replaceDocumentIdWithUnderscoreId],
  });
  console.log(collcetions);

  seeder
    .import(collcetions)
    .then(() => {
      console.log("Successs");
    })
    .catch((err) => {
      console.log("Error", err);
    });
};

seed();
