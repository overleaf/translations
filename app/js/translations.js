// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const i18n = require('i18next')
const _ = require('underscore')
const path = require('path')

module.exports = {
  setup(options) {
    const subdomainLang =
      (options != null ? options.subdomainLang : undefined) || {}
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
      fallbackLng: (options != null ? options.defaultLng : undefined) || 'en',
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

      let lang
      if (
        options &&
        options.subdomainLang &&
        options.subdomainLang[subdomain]
      ) {
        lang = options.subdomainLang[subdomain].lngCode
      }

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
