require('chai').should()
const SandboxedModule = require('sandboxed-module')
const path = require('path')
const modulePath = path.join(__dirname, '../../../app/js/translations.js')
const { expect } = require('chai')

describe('translations', function() {
  beforeEach(function() {
    this.settings = {}
    this.translations = SandboxedModule.require(modulePath, {
      requires: {
        'settings-sharelatex': this.settings,
        'logger-sharelatex': { log() {} }
      }
    })

    const opts = {
      subdomainLang: {
        www: { lngCode: 'en', url: 'www.sharelatex.com' },
        fr: { lngCode: 'fr', url: 'fr.sharelatex.com' },
        da: { lngCode: 'da', url: 'da.sharelatex.com' }
      }
    }
    this.translations = this.translations.setup(opts)
    this.req = {
      originalUrl: "doesn'tmatter.sharelatex.com/login",
      headers: {
        'accept-language': ''
      }
    }
    this.res = {}
  })

  describe('setLangBasedOnDomainMiddlewear', function() {
    it('should set the lang to french if the domain is fr', function(done) {
      this.req.url = 'fr.sharelatex.com/login'
      this.req.headers.host = 'fr.sharelatex.com'
      this.translations.expressMiddlewear(this.req, this.req, () => {
        this.translations.setLangBasedOnDomainMiddlewear(
          this.req,
          this.res,
          () => {
            this.req.lng.should.equal('fr')
            done()
          }
        )
      })
    })

    describe('showUserOtherLng', function() {
      it('should set it to true if the languge based on headers is different to lng', function(done) {
        this.req.headers['accept-language'] = 'da, en-gb;q=0.8, en;q=0.7'
        this.req.url = 'fr.sharelatex.com/login'
        this.req.headers.host = 'fr.sharelatex.com'
        this.translations.expressMiddlewear(this.req, this.req, () => {
          this.translations.setLangBasedOnDomainMiddlewear(
            this.req,
            this.res,
            () => {
              this.req.showUserOtherLng.should.equal('da')
              done()
            }
          )
        })
      })

      it('should not set prop', function(done) {
        this.req.headers['accept-language'] = 'da, en-gb;q=0.8, en;q=0.7'
        this.req.url = 'da.sharelatex.com/login'
        this.req.headers.host = 'da.sharelatex.com'
        this.translations.expressMiddlewear(this.req, this.req, () => {
          this.translations.setLangBasedOnDomainMiddlewear(
            this.req,
            this.res,
            () => {
              expect(this.req.showUserOtherLng).to.not.exist
              done()
            }
          )
        })
      })
    })
  })
})
