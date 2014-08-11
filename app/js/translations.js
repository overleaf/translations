(function() {
  var i18n, _;

  i18n = require("i18next");

  _ = require("underscore");

  module.exports = {
    setup: function(options) {
      var availableLngs, setLangBasedOnDomainMiddlewear, subdomainLang;
      subdomainLang = (options != null ? options.subdomainLang : void 0) || {};
      availableLngs = _.pluck(_.values(subdomainLang), "lngCode");
      i18n.init({
        resGetPath: __dirname + "/locales/__lng__.json",
        saveMissing: true,
        resSetPath: __dirname + "/locales/missing-__lng__.json",
        sendMissingTo: "fallback",
        fallbackLng: (options != null ? options.defaultLng : void 0) || "en",
        detectLngFromHeaders: true,
        useCookie: false,
        preload: availableLngs,
        supportedLngs: availableLngs
      });
      setLangBasedOnDomainMiddlewear = function(req, res, next) {
        var host, lang, subdomain, _ref, _ref1;
        host = req.headers.host;
        if (host == null) {
          return next();
        }
        subdomain = host.slice(0, host.indexOf("."));
        if (subdomain == null) {
          return next();
        }
        lang = options != null ? (_ref = options.subdomainLang) != null ? (_ref1 = _ref[subdomain]) != null ? _ref1.lngCode : void 0 : void 0 : void 0;
        if (req.originalUrl.indexOf("setLng") === -1 && (lang != null)) {
          req.i18n.setLng(lang);
        }
        if (req.language !== req.lng) {
          req.showUserOtherLng = req.language;
        }
        return next();
      };
      return {
        expressMiddlewear: i18n.handle,
        setLangBasedOnDomainMiddlewear: setLangBasedOnDomainMiddlewear,
        i18n: i18n
      };
    }
  };

}).call(this);
