const fs = require("fs");
const { onRequest } = require("firebase-functions/v2/https");
const { exportCollections } = require("./exportCollections");
const {
  buildCollectionsFromKeys,
} = require("../utils/buildCollectionsFromKey");

const getCollectionKeysFromRequest = (req) => {
  const isPost = req.method.toLocaleLowerCase() === "post";

  const { body, query } = req;

  if (isPost) {
    return body;
  } else {
    const { collectionKeys = [], type } = query;

    return {
      type,
      collectionKeys: collectionKeys.split(","),
    };
  }
};

const initExportRequest = (apis) => {
  return onRequest(async (req, res) => {
    console.log(
      "🚀 ~ exports.node_runner_request=onRequest ~ req.body;:",
      req.body
    );

    const { collectionKeys = [], type } = getCollectionKeysFromRequest(req);

    // req.query

    // return res.send(collectionKeys);

    try {
      const collectionApis = buildCollectionsFromKeys(collectionKeys, apis);

      console.log(
        "🚀 ~ exports.node_runner_request=onRequest ~ collectionApis:",
        collectionApis
      );

      const collections = await exportCollections(collectionApis);

      switch (type) {
        case "file": {
          const data = JSON.stringify(collections);

          const filePath = `${__dirname}/collectionsExport.json`;
          fs.writeFileSync(filePath, data, "utf-8");

          return fs.readFile(filePath, (err, data) => {
            fs.unlink(filePath, () => {});
            if (err) {
              console.error("Error reading file:", err);
              return res.status(500).send("Error reading file");
            }

            res.setHeader(
              "Content-disposition",
              `attachment; filename=collectionsExport.json`
            );
            res.setHeader("Content-type", "text/plain"); // Adjust content type

            res.status(200).send(data);
          });
        }

        default: {
          return res.send(collections);
        }
      }
    } catch (error) {
      console.log("🚀 ~ error:", error);
      return res.send(error);
    }
  });
};

module.exports = { initExportRequest };

// const data = `const collections = ${JSON.stringify(
//   collections,
//   null,
//   4
// )};\n\nmodule.exports = { collections };`;

// const filePath = `${__dirname}/collectionsExport.js`;
