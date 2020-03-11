// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

// This is not 100% fool proof so check anything before deleting it.

// grep -r  --include "*.jade" "translate" . > /tmp/translates_strings
// grep -r  --include "*.coffee" "title:" . >> /tmp/translates_strings
const fs = require('fs')
const _ = require('underscore')

const file = fs.readFileSync('./grep_output', 'utf-8')
const translations = fs.readFileSync('./locales/en.json', 'utf-8')
const translationsKeys = Object.keys(JSON.parse(translations))

const keysUsedInSite = []

file.split('\n').forEach(function(line) {
  let results = line.match(/translate\(["']\w+/g)
  if (results != null) {
    results.forEach(function(result) {
      const jadeKey = result.replace(/translate\(['"]/g, '')
      if (jadeKey != null) {
        return keysUsedInSite.push(jadeKey)
      }
    })
  }

  results = line.match(/title:\s?["']\w+/g)
  return results != null
    ? results.forEach(function(result) {
        const titleKey = result.replace(/title:\s?['"]/g, '')
        if (titleKey != null) {
          return keysUsedInSite.push(titleKey)
        }
      })
    : undefined
})

keysUsedInSite.forEach(function(key) {
  const isUsed = _.contains(translationsKeys, key)
  if (!isUsed) {
    return console.log('missing translation:', key)
  }
})

console.log('------')

translationsKeys.forEach(function(key) {
  const isUsed = _.contains(keysUsedInSite, key)
  if (!isUsed) {
    return console.log('unused translation:', key)
  }
})
