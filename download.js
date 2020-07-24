const fs = require('fs')
const oneSky = require('@brainly/onesky-utils')
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

async function download() {
  try {
    const content = await oneSky.getMultilingualFile({
      apiKey: process.env.ONE_SKY_PUBLIC_KEY,
      secret: process.env.ONE_SKY_PRIVATE_KEY,
      projectId: '25049',
      fileName: 'en-US.json'
    })
    const json = JSON.parse(content)

    for (const [code, lang] of Object.entries(json)) {
      for (const [key, value] of Object.entries(lang.translation)) {
        lang.translation[key] = sanitizeHtml(value, sanitizeOpts)
      }
      fs.writeFileSync(
        `./locales/${code}.json`,
        JSON.stringify(lang.translation, null, 2)
      )
    }

    fs.createReadStream('./locales/en-GB.json').pipe(
      fs.createWriteStream('./locales/en-US.json')
    )
    fs.createReadStream('./locales/en-GB.json').pipe(
      fs.createWriteStream('./locales/en.json')
    )
    fs.createReadStream('./locales/zh-CN.json').pipe(
      fs.createWriteStream('./locales/cn.json')
    )
  } catch (error) {
    console.error(error)
  }
}

download()
