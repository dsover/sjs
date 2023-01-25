const fs = require('fs');
const validFileTypes = ['js'];

const requireFiles = function (directory, app, extras) {
    fs.readdirSync(directory).forEach(function (fileName) {
        // Recurse if directory
        if (fs.lstatSync(directory + '/' + fileName).isDirectory()) {
            requireFiles(directory + '/' + fileName, app, extras);
        } else {

            // Skip this file
            if (fileName === 'index.js' && directory === __dirname) return;

            // Skip unknown filetypes
            if (validFileTypes.indexOf(fileName.split('.').pop()) === -1) return;

            // Require the file.
            require(directory + '/' + fileName)(app, extras);
        }
    })
};

module.exports = function (app, extras) {
    requireFiles(__dirname, app, extras);
}