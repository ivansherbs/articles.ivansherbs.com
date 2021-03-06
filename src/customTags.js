const fs = require('fs');

const I18N = require('../content/_data/i18n');

module.exports = function(eleventyConfig) {
    eleventyConfig.addShortcode('articleFragment', function(path) {
        var fullPath = '_site/' + path + '/index.html';
        return fs.readFileSync(fullPath);
    });

    eleventyConfig.addPairedShortcode('i18n', function(defaultText, key, forceLanguage) {
        var pageLocationLanguage = (this.page.filePathStem.match(/^\/([a-zA-Z]{2})\//) || [])[1];
        var language = (forceLanguage || pageLocationLanguage || 'EN').toUpperCase();
        return (I18N[key] || {})[language] || defaultText || `? I18N:${key}:${language} ?`;
    });
};
