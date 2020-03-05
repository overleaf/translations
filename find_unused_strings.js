
#This is not 100% fool proof so check anything before deleting it.

# grep -r  --include "*.jade" "translate" . > /tmp/translates_strings
# grep -r  --include "*.coffee" "title:" . >> /tmp/translates_strings
fs = require("fs")
_ = require("underscore")

file = fs.readFileSync("./grep_output", "utf-8")
translations = fs.readFileSync("./locales/en.json", "utf-8")
translationsKeys = Object.keys(JSON.parse(translations))


keysUsedInSite = []

file.split("\n").forEach (line)->
	results = line.match(/translate\(["']\w+/g)
	results?.forEach (result)->
		jadeKey = result.replace(/translate\(['"]/g, "")
		if jadeKey?
			keysUsedInSite.push jadeKey

	results = line.match(/title:\s?["']\w+/g)
	results?.forEach (result)->
		titleKey = result.replace(/title:\s?['"]/g, "")
		if titleKey?
			keysUsedInSite.push titleKey


keysUsedInSite.forEach (key)->
	isUsed = _.contains translationsKeys, key
	if !isUsed
		console.log "missing translation:", key

console.log "------"


translationsKeys.forEach (key)->
	isUsed = _.contains keysUsedInSite, key
	if !isUsed
		console.log "unused translation:", key
