fs = require("fs")
publicKey = process.argv[2]
privateKey = process.argv[3]

onesky = require('onesky')(publicKey, privateKey)

onesky.string.output platformId:"25049", (err, r)->
	langs = Object.keys(r.translation['en-US.json'])
	langs.forEach (lang)->
		data = r.translation['en-US.json'][lang]
		fs.writeFileSync "./locales/#{lang}.json", JSON.stringify(data)

	fs.createReadStream("./locales/en-GB.json").pipe(fs.createWriteStream("./locales/en-US.json"))
	fs.createReadStream("./locales/en-GB.json").pipe(fs.createWriteStream("./locales/en.json"))


