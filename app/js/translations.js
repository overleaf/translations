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

      initImmediate: false,

      compatibilityJSON: 'v1',

      preload: availableLngs,
      supportedLngs: availableLngs,
      fallbackLng: options.defaultLng || 'en'
    })

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

      // If the set language (req.lng) is different from the language
      // automatically determined by the i18next middleware (req.language), then
      // set flag which will show a banner offering to switch to the appropriate
      // language
      if (req.language !== req.lng) {
        req.showUserOtherLng = req.language
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
