/***
 * Utility to ease the task of registering templates and urls.
 * Useful with require-text module.
 */

define(function(require) {
    var templateUtil = {};

    templateUtil.registerTemplates = function(ng, $templateCache, config, $log){
        ng.forEach(config, function(value, key){
            if(!value.url || !value.template){
                console.log("Register template invalid config: ");
                console.log(value);
                return;
            }
            console.log("Registering templateCache: " + value.url);
            $templateCache.put(value.url, value.template);
        }, templateUtil);
    };

    return templateUtil;

});
