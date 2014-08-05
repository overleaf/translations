i18n = require("i18next")
_ = require("underscore")


module.exports = setup: (options) ->

	subdomainLang = options.subdomainLang

	i18n.init
		resGetPath: __dirname + "/locales/__lng__.json"
		saveMissing: true
		resSetPath: __dirname + "/locales/missing-__lng__.json"
		sendMissingTo: "fallback"
		fallbackLng: options?.defaultLng || "en-US"
		detectLngFromHeaders: false
		useCookie: false
		preload: _.values(subdomainLang)

	setLangBasedOnDomainMiddlewear = (req, res, next) ->

		host = req.headers.host
		subdomain = host.slice(0, host.indexOf("."))
		if req.originalUrl.indexOf("setLng") is -1 and ((if typeof subdomainLang isnt "undefined" and subdomainLang isnt null then subdomainLang[subdomain] else undefined))
			lang = subdomainLang[subdomain]
			req.i18n.setLng lang
		next()

	expressMiddlewear: i18n.handle
	setLangBasedOnDomainMiddlewear: setLangBasedOnDomainMiddlewear
	i18n: i18n