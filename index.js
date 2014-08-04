var i18n = require("i18next");
var _ = require("underscore")


module.exports = {
	setup: function(subdomainLang){
		i18n.init(
			{
				resGetPath: __dirname+'/locales/__lng__.json',
				saveMissing: true,
				resSetPath: __dirname+'/locales/missing-__lng__.json',
				sendMissingTo: 'fallback',
				fallbackLng:"en",
				detectLngFromHeaders:false,
				useCookie:false,
				preload:_.values(subdomainLang)
			}
		)
		
		var domainSetLangMiddlewear = function(req, res, next) {
			var host, lang, subdomain;
			host = req.headers.host;
			subdomain = host.slice(0, host.indexOf("."));
			lang = subdomainLang[subdomain];
			if (req.originalUrl.indexOf("setLng") === -1 && (lang != null)) {
				req.i18n.setLng(lang);
			}
			return next();
		};

		return {
			expressMiddlewear: i18n.handle,
			domainSetLangMiddlewear:domainSetLangMiddlewear,
			i18n:i18n
		}
	}
}





