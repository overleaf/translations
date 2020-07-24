const { promises: fs } = require('fs')
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
      for (let [key, value] of Object.entries(lang.translation)) {
        // Handle multi-line strings as arrays by joining on newline
        if (Array.isArray(value)) {
          value = value.join('\n')
        }
        lang.translation[key] = sanitizeHtml(value, sanitizeOpts)
      }

      await fs.writeFile(
        `./locales/${code}.json`,
        JSON.stringify(lang.translation, null, 2)
      )
    }

    // Copy files, so we have appropriate dialects
    await fs.copyFile('./locales/en-GB.json', './locales/en-US.json')
    await fs.copyFile('./locales/en-GB.json', './locales/en.json')
    await fs.copyFile('./locales/zh-CN.json', './locales/cn.json')
  } catch (error) {
    console.error(error)
  }
}

download()
