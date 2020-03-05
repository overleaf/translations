fs = require("fs")
publicKey = process.argv[2]
privateKey = process.argv[3]
_ = require("underscore")

onesky = require('onesky')(publicKey, privateKey)
sanitizeHtml = require('sanitize-html')
sanitizeOpts = 
	allowedTags: [ 'b', 'strong', 'a', 'code' ],
	allowedAttributes:
		'a': [ 'href', "class" ]
	textFilter: (text) ->
		text.replace(/\{\{/, '&#123;&#123;').replace(/\}\}/, '&#125;&#125;')

onesky.string.output platformId:"25049", (err, r)->
	langs = Object.keys(r.translation['en-US.json'])
	langs.forEach (lang)->
		data = r.translation['en-US.json'][lang]
		_.each data, (value, key)->
			data[key] = sanitizeHtml(value, sanitizeOpts)
		fs.writeFileSync "./locales/#{lang}.json", JSON.stringify(data,null,2)

	fs.createReadStream("./locales/en-GB.json").pipe(fs.createWriteStream("./locales/en-US.json"))
	fs.createReadStream("./locales/en-GB.json").pipe(fs.createWriteStream("./locales/en.json"))
	fs.createReadStream("./locales/zh-CN.json").pipe(fs.createWriteStream("./locales/cn.json"))

