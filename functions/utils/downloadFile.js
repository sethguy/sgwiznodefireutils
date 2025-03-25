const fs = require("fs");
const { mkdir } = require("fs/promises");
const { Readable } = require("stream");
const { finished } = require("stream/promises");
const path = require("path");

exports.downloadFile = async (url, destination) => {
  const res = await fetch(url);

  const destFolder = getDestFolder(destination);

  if (!fs.existsSync(destFolder)) await mkdir(destFolder, { recursive: true });

  const fileStream = fs.createWriteStream(destination, { flags: "wx" });
  await finished(Readable.fromWeb(res.body).pipe(fileStream));

  return { url, destination, destFolder };
};

const getDestFolder = (fullPath) => {
  const { dir } = path.parse(fullPath);
  return dir;
};
