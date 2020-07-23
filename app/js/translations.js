const i18n = require('i18next')
const _ = require('underscore')
const path = require('path')

module.exports = {
  setup(options = {}) {
    const subdomainLang = options.subdomainLang || {}
    const availableLngs = _.pluck(_.values(subdomainLang), 'lngCode')
    i18n.init({
      resGetPath: path.resolve(__dirname, '../../', 'locales/__lng__.json'),
      saveMissing: true,
      resSetPath: path.resolve(
        __dirname,
        '../../',
        'locales/missing-__lng__.json'
      ),
      sendMissingTo: 'fallback',
      fallbackLng: options.defaultLng || 'en',
      detectLngFromHeaders: true,
      useCookie: false,
      preload: availableLngs,
      supportedLngs: availableLngs
    })
    const setLangBasedOnDomainMiddlewear = function(req, res, next) {
      const { host } = req.headers
      if (host == null) {
        return next()
      }
      const parts = host.split(/[.-]/)
      const subdomain = parts[0]

      const lang = subdomainLang[subdomainLang]
        ? subdomainLang[subdomain].lngCode
        : null

      if (req.originalUrl.indexOf('setLng') === -1 && lang != null) {
        req.i18n.setLng(lang)
      }
      if (req.language !== req.lng) {
        req.showUserOtherLng = req.language
      }
      next()
    }

    return {
      expressMiddlewear: i18n.handle,
      setLangBasedOnDomainMiddlewear,
      i18n
    }
  }
}
