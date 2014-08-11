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
      this.settings = {};
      return this.translations = SandboxedModule.require(modulePath, {
        requires: {
          "settings-sharelatex": this.settings,
          "logger-sharelatex": {
            log: function() {}
          }
        }
      });
    });
    return describe("setLangBasedOnDomainMiddlewear", function() {
      return it("should fail", function(done) {
        return assert(true);
      });
    });
  });

}).call(this);
