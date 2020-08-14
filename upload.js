const { promises: fs } = require('fs')
const oneSky = require('@brainly/onesky-utils')

function sleep(delay) {
  return new Promise(resolve => setTimeout(resolve, delay))
}

function withAuth(options) {
  return Object.assign(options, {
    apiKey: process.env.ONE_SKY_PUBLIC_KEY,
    secret: process.env.ONE_SKY_PRIVATE_KEY,
    projectId: '25049'
  })
}

async function uploadLocales() {
  // Docs: https://github.com/onesky/api-documentation-platform/blob/master/resources/file.md#upload---upload-a-file
  const importTask = await oneSky.postFile(
    withAuth({
      fileName: 'en-US.json',
      language: 'en-GB', // see below
      format: 'HIERARCHICAL_JSON',
      content: await fs.readFile('./locales/en.json'),
      keepStrings: true // backwards compatibility
    })
  )
  return importTask.last_import.id
}

async function getImportTask(importId) {
  // Docs: https://github.com/onesky/api-documentation-platform/blob/master/resources/import_task.md
  // TODO(das7pad): wait for this PR to land: https://github.com/brainly/nodejs-onesky-utils/pull/43
  return oneSky.getImportTask(withAuth({ importId }))
}

async function pollUploadStatus(importId) {
  let task
  while ((task = await getImportTask(importId)).status === 'in-progress') {
    await sleep(5000)
  }
  if (task.status === 'failed') {
    console.error({ task })
    throw new Error('upload failed')
  }
}

async function main() {
  const importId = await uploadLocales()
  await pollUploadStatus(importId)
}

main().catch(error => {
  console.error({ error })
  process.exit(1)
})
