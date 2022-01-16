const sharp = require("sharp");
const fs = require("fs");
const glob = require("glob");

glob("./RP/textures/blocks/**/*.png", (err, filePath) => {
  filePath.forEach((v) => {
    createTexture(v);
  });
  console.log(filePath)
});

function createTexture(texture) {
  let heightmapTexture = texture.replace(/.png/g, "_heightmap.png")
  sharp(texture)
  .bandbool(sharp.bool.and)
  .toFile(heightmapTexture, function (err, info) {
  });
}