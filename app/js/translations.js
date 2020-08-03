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
        loadPath: path.join(__dirname, '../../locales/__lng__.json')
      },

      // Load translation files synchronously: https://www.i18next.com/overview/configuration-options#initimmediate
      initImmediate: false,

      // We use the legacy v1 JSON format, so configure interpolator to use
      // underscores instead of curly braces
      interpolation: {
        prefix: '__',
        suffix: '__',
        unescapeSuffix: 'HTML'
      },

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

    const expressMiddleware = function(req, res, next) {
      middleware.handle(i18n)(req, res, (...args) => {
        // Decorate req.i18n with translate function alias for backwards
        // compatibility
        req.i18n.translate = req.i18n.t
        next(...args)
      })
    }

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
