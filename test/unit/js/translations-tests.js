(function() {
  var SandboxedModule, assert, expect, modulePath, path, should, sinon;

  should = require('chai').should();

  SandboxedModule = require('sandboxed-module');

  assert = require('assert');

  path = require('path');

  sinon = require('sinon');

  modulePath = path.join(__dirname, "../../../app/js/translations.js");

  expect = require("chai").expect;

  describe("translations", function() {
    beforeEach(function() {
      var opts;
      this.settings = {};
      this.translations = SandboxedModule.require(modulePath, {
        requires: {
          "settings-sharelatex": this.settings,
          "logger-sharelatex": {
            log: function() {}
          }
        }
      });
      opts = {
        subdomainLang: {
          www: {
            lngCode: "en",
            url: "www.sharelatex.com"
          },
          fr: {
            lngCode: "fr",
            url: "fr.sharelatex.com"
          },
          da: {
            lngCode: "da",
            url: "da.sharelatex.com"
          }
        }
      };
      this.translations = this.translations.setup(opts);
      this.req = {
        originalUrl: "doesn'tmatter.sharelatex.com/login",
        headers: {
          "accept-language": ""
        }
      };
      return this.res = {};
    });
    return describe("setLangBasedOnDomainMiddlewear", function() {
      it("should set the lang to french if the domain is fr", function(done) {
        this.req.url = "fr.sharelatex.com/login";
        this.req.headers.host = "fr.sharelatex.com";
        return this.translations.expressMiddlewear(this.req, this.res, (function(_this) {
          return function() {
            return _this.translations.setLangBasedOnDomainMiddlewear(_this.req, _this.res, function() {
              _this.req.lng.should.equal("fr");
              return done();
            });
          };
        })(this));
      });
      return describe("showUserOtherLng", function() {
        it("should set it to true if the languge based on headers is different to lng", function(done) {
          this.req.headers["accept-language"] = "da, en-gb;q=0.8, en;q=0.7";
          this.req.url = "fr.sharelatex.com/login";
          this.req.headers.host = "fr.sharelatex.com";
          return this.translations.expressMiddlewear(this.req, this.res, (function(_this) {
            return function() {
              return _this.translations.setLangBasedOnDomainMiddlewear(_this.req, _this.res, function() {
                _this.req.showUserOtherLng.should.equal("da");
                return done();
              });
            };
          })(this));
        });
        return it("should not set prop", function(done) {
          this.req.headers["accept-language"] = "da, en-gb;q=0.8, en;q=0.7";
          this.req.url = "da.sharelatex.com/login";
          this.req.headers.host = "da.sharelatex.com";
          return this.translations.expressMiddlewear(this.req, this.res, (function(_this) {
            return function() {
              return _this.translations.setLangBasedOnDomainMiddlewear(_this.req, _this.res, function() {
                expect(_this.req.showUserOtherLng).to.not.exist;
                return done();
              });
            };
          })(this));
        });
      });
    });
  });

}).call(this);
