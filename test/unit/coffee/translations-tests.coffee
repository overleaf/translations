should = require('chai').should()
SandboxedModule = require('sandboxed-module')
assert = require('assert')
path = require('path')
sinon = require('sinon')
modulePath = path.join __dirname, "../../../app/js/translations.js"
expect = require("chai").expect

describe "translations", ->

	beforeEach ->

		@settings = {}
		@translations = SandboxedModule.require modulePath, requires:
			"settings-sharelatex":@settings
			"logger-sharelatex": log:->


	describe "setLangBasedOnDomainMiddlewear", ->

