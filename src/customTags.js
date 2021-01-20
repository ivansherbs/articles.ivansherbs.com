let fs = require('fs');
let process = require('process');

const ENUM_SHOPIFY_BUTTON_DESTINATIONS = ['cart', 'modal', 'checkout', 'onlineStore'];

module.exports = function(eleventyConfig) {
    eleventyConfig.addLiquidTag('resourceDomain', function() {
        return {
            render: function() {
                return Promise.resolve(process.env.RESOURCE_BASE_URL);
            }
        };
    });

    eleventyConfig.addShortcode('articleFragment', function(path) {
        var fullPath = '_site/' + path + '/index.html';
        return fs.readFileSync(fullPath);
    });

    eleventyConfig.addShortcode('shopifyCollection', function() {

        // abort if no arguments
        if (!arguments[0]) {
            return '';
        }

        // initializations
        var shopifyOptions = {
            buttonDestination: ENUM_SHOPIFY_BUTTON_DESTINATIONS[0]
        };

        // default usage with page front-matter configuration
        if (typeof arguments[0] === 'object') {
            shopifyOptions.collection = arguments[0].collection;
            shopifyOptions.buttonDestination = arguments[0].buttonDestination;
            shopifyOptions.buttonText = arguments[0].buttonText;
        }
        // custom usage with inline configuration
        else {
            console.dir(arguments);
            shopifyOptions.collection = arguments[0];
            for (var i = 1; i < arguments.length; ++i) {
                shopifyOptions[arguments[i]] = arguments[++i];
            }
        }

        // validations
        if (!shopifyOptions.collection) {
            return '';
        }
        if (ENUM_SHOPIFY_BUTTON_DESTINATIONS.indexOf(shopifyOptions.buttonDestination) == -1) {
            shopifyOptions.buttonDestination = ENUM_SHOPIFY_BUTTON_DESTINATIONS[0];
        }

        // build the data attributes
        var dataAttributes = '';
        for (var key in shopifyOptions) {
            if (shopifyOptions[key]) {
                dataAttributes += ` data-${ key }="${ shopifyOptions[key] }"`;
            }
        }

        return `<div class="shopify-collection" ${ dataAttributes }></div>`;
    });
};
