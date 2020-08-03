const fs = require('fs')
const publicKey = process.env.ONE_SKY_PUBLIC_KEY
const privateKey = process.env.ONE_SKY_PRIVATE_KEY

const onesky = require('onesky')(publicKey, privateKey)
const sanitizeHtml = require('sanitize-html')
const sanitizeOpts = {
  allowedTags: ['b', 'strong', 'a', 'code'],
  allowedAttributes: {
    a: ['href', 'class']
  },
  textFilter(text) {
    return text.replace(/\{\{/, '&#123;&#123;').replace(/\}\}/, '&#125;&#125;')
  }
}

onesky.string.output({ platformId: '25049' }, function(err, r) {
  if (err) {
    console.error(err)
    return
  }

  for (const [code, lang] of Object.entries(r.translation['en-US.json'])) {
    for (const [key, value] of Object.entries(lang)) {
      lang[key] = sanitizeHtml(value, sanitizeOpts)
    }

    fs.writeFileSync(`./locales/${code}.json`, JSON.stringify(lang, null, 2))
  }

  fs.createReadStream('./locales/en-GB.json').pipe(
    fs.createWriteStream('./locales/en-US.json')
  )
  fs.createReadStream('./locales/en-GB.json').pipe(
    fs.createWriteStream('./locales/en.json')
  )
  return fs
    .createReadStream('./locales/zh-CN.json')
    .pipe(fs.createWriteStream('./locales/cn.json'))
})
