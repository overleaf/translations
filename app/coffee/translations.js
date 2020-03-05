i18n = require("i18next")
_ = require("underscore")
path = require("path")

module.exports = 

	setup: (options) ->
		subdomainLang = options?.subdomainLang || {}
		availableLngs = _.pluck(_.values(subdomainLang), "lngCode")
		i18n.init
			resGetPath: path.resolve(__dirname,"../../", "locales/__lng__.json")
			saveMissing: true
			resSetPath: path.resolve(__dirname,"../../", "locales/missing-__lng__.json")
			sendMissingTo: "fallback"
			fallbackLng: options?.defaultLng || "en"
			detectLngFromHeaders: true
			useCookie: false
			preload: availableLngs
			supportedLngs: availableLngs
		setLangBasedOnDomainMiddlewear = (req, res, next) ->

			host = req.headers.host
			if !host?
				return next()
			parts = host.split(/[.-]/)
			subdomain = parts[0]
			lang = options?.subdomainLang?[subdomain]?.lngCode
			if req.originalUrl.indexOf("setLng") == -1 and lang?
				req.i18n.setLng lang
			if req.language != req.lng
				req.showUserOtherLng = req.language
			next()

		expressMiddlewear: i18n.handle
		setLangBasedOnDomainMiddlewear: setLangBasedOnDomainMiddlewear
		i18n: i18n
