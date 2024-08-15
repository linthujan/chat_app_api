const fs = require("fs");

function deleteFile(path) {
  fs.unlink(path, () => {
    console.log("File Deleted Successfully");
  });
}

module.exports = {
  deleteFile,
}