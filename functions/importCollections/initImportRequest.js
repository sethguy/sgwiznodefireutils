const { onRequest } = require("firebase-functions/v2/https");
const os = require("os");
const path = require("path");
const fs = require("fs");

const { importCollections } = require("./importCollections");
const { busPromise } = require("./busPromise");

const writePromis = (file, filename) => {
  return new Promise((resolve, rej) => {
    try {
      const tmpdir = os.tmpdir();

      console.log("🚀 ~writePromis ~ tmpdir:", tmpdir);

      const filepath = path.join(tmpdir, filename);

      const writeStream = fs.createWriteStream(filepath, {
        encoding: "utf-8",
      });

      writeStream.on("finish", async () => {
        console.log("🚀 ~ writeStream.on ~ finish:");

        resolve(filepath);
      });

      writeStream.on("error", (error) => {
        console.log("🚀 ~writePromis ~ error:", error);
        rej(error);
      });

      file.pipe(writeStream);
    } catch (error) {
      console.log("🚀 ~ writePromis ~ error:", error);

      rej(error);
    }
  });
};

const initImportRequest = (apis) => {
  return onRequest(async (req, res) => {
    // console.log(
    //   "🚀 ~ exports.node_runner_request=onRequest ~ req.body;:",
    //   req.body
    // );

    try {
      const { fieldname, file, filedata, encoding, mimetype } =
        await busPromise(req);

      const { filename } = filedata;

      const filepath = await writePromis(file, filename);
      const raw = fs.readFileSync(filepath, "utf-8");

      const collections = JSON.parse(raw);
      fs.unlinkSync(filepath);
       await importCollections(collections, apis);

      const cPack = {
        collections: collections.length,
        keys: collections.map((collection) => {
          const { collectionKey, items = [] } = collection;

          return {
            collectionKey,
            items: items.length,
          };
        }),
      };
      console.log("🚀 ~ returnonRequest ~ cPack:", cPack);
      res.send(cPack);
    } catch (error) {
      console.log("🚀 ~ error:", error);
      res.send(error);
    }

    // res.send("node_runner_request");
  });
};

module.exports = { initImportRequest };
