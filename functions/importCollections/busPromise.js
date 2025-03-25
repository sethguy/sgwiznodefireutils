const Busboy = require("busboy");

const busPromise = (req) => {
  return new Promise((resolve, rej) => {
    try {
      const busboy = Busboy({ headers: req.headers });

      busboy.on("file", (fieldname, file, filedata, encoding, mimetype) => {
        resolve({ fieldname, file, filedata, encoding, mimetype });
      });
      busboy.on("error", (error) => {
        console.log("🚀 ~ busboy.on ~ error:", error);
        rej(error);
      });
      busboy.end(req.rawBody);
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error);

      rej(error);
    }
  });
};
exports.busPromise = busPromise;
