i18n = require("i18next")
_ = require("underscore")


module.exports = 

	setup: (options) ->
		subdomainLang = options?.subdomainLang || {}

		i18n.init
			resGetPath: __dirname + "/locales/__lng__.json"
			saveMissing: true
			resSetPath: __dirname + "/locales/missing-__lng__.json"
			sendMissingTo: "fallback"
			fallbackLng: options?.defaultLng || "en"
			detectLngFromHeaders: false
			useCookie: false
			preload: _.pluck(_.values(subdomainLang), "lngCode")

		setLangBasedOnDomainMiddlewear = (req, res, next) ->

			host = req.headers.host
			if !host?
				return next()
			subdomain = host.slice(0, host.indexOf("."))
			if !subdomain?
				return next()
			lang = options?.subdomainLang?[subdomain]?.lngCode
			if req.originalUrl.indexOf("setLng") == -1 and lang?
				req.i18n.setLng lang
			next()

		expressMiddlewear: i18n.handle
		setLangBasedOnDomainMiddlewear: setLangBasedOnDomainMiddlewear
		i18n: i18n