const i18n = require('i18next')
const fsBackend = require('i18next-fs-backend')
const middleware = require('i18next-http-middleware')
const path = require('path')

module.exports = {
  setup(options = {}) {
    const subdomainLang = options.subdomainLang || {}
    const availableLngs = Object.values(subdomainLang).map(c => c.lngCode)

    i18n.use(fsBackend).init({
      backend: {
        loadPath: path.join(__dirname, '../../locales/{{lng}}.json')
      },

      // Load translation files synchronously: https://www.i18next.com/overview/configuration-options#initimmediate
      initImmediate: false,

      // We use the i18next v1 JSON format: https://www.i18next.com/misc/json-format#i-18-next-json-v1
      compatibilityJSON: 'v1',

      preload: availableLngs,
      supportedLngs: availableLngs,
      fallbackLng: options.defaultLng || 'en'
    })

    const langDetector = new middleware.LanguageDetector(i18n.services)

    function setLangBasedOnDomainMiddleware(req, res, next) {
      // Determine language from subdomain
      const { host } = req.headers
      if (host == null) {
        return next()
      }
      const [subdomain] = host.split(/[.-]/)
      const lang = subdomainLang[subdomain]
        ? subdomainLang[subdomain].lngCode
        : null

      // Unless setLng query param is set, use subdomain lang
      if (!req.originalUrl.includes('setLng') && lang != null) {
        req.i18n.changeLanguage(lang)
      }

      // If the set language is different from the language detection (based on
      // the Accept-Language header), then set flag which will show a banner
      // offering to switch to the appropriate library
      const detectedLanguage = langDetector.detect(req, res)
      if (req.language !== detectedLanguage) {
        req.showUserOtherLng = detectedLanguage
      }

      next()
    }

    const expressMiddleware = middleware.handle(i18n)
    return {
      expressMiddleware,
      setLangBasedOnDomainMiddleware,
      i18n,

      // Backwards compatibility with long-standing typo
      expressMiddlewear: expressMiddleware,
      setLangBasedOnDomainMiddlewear: setLangBasedOnDomainMiddleware
    }
  }
}
