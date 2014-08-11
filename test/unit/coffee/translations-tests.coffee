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

		opts = 
			subdomainLang:
				www: {lngCode:"en", url: "www.sharelatex.com"}
				fr: {lngCode:"fr", url: "fr.sharelatex.com"}
				da: {lngCode:"da", url: "da.sharelatex.com"}
		@translations = @translations.setup(opts)
		@req =
			originalUrl:"doesn'tmatter.sharelatex.com/login"
			headers:
				"accept-language":""
		@res = {}


	describe "setLangBasedOnDomainMiddlewear", ->

		it "should set the lang to french if the domain is fr", (done)->
			@req.url = "fr.sharelatex.com/login"
			@req.headers.host = "fr.sharelatex.com"
			@translations.expressMiddlewear @req, @req, =>
				@translations.setLangBasedOnDomainMiddlewear @req, @res, =>
					@req.lng.should.equal "fr"
					done()


		describe "showUserOtherLng", ->

			it "should set it to true if the languge based on headers is different to lng", (done)->
				@req.headers["accept-language"] = "da, en-gb;q=0.8, en;q=0.7"
				@req.url = "fr.sharelatex.com/login"
				@req.headers.host = "fr.sharelatex.com"
				@translations.expressMiddlewear @req, @req, =>
					@translations.setLangBasedOnDomainMiddlewear @req, @res, =>
						@req.showUserOtherLng.should.equal "da"
						done()


			it "should not set prop", (done)->
				@req.headers["accept-language"] = "da, en-gb;q=0.8, en;q=0.7"
				@req.url = "da.sharelatex.com/login"
				@req.headers.host = "da.sharelatex.com"
				@translations.expressMiddlewear @req, @req, =>
					@translations.setLangBasedOnDomainMiddlewear @req, @res, =>
						expect(@req.showUserOtherLng).to.not.exist
						done()
