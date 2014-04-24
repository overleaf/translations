fs = require("fs")
publicKey = process.argv[2]
privateKey = process.argv[3]

onesky = require('onesky')(publicKey, privateKey)

onesky.string.output platformId:"25049", (err, r)->
	langs = Object.keys(r.translation['en-US.json'])
	langs.forEach (lang)->
		data = r.translation['en-US.json'][lang]
		fs.writeFile "./locales/#{lang}.json", JSON.stringify(data)
