import {promises as fs, existsSync} from 'fs'

export async function load({params}) {
  const {slug, postType} = params
  const postDir =
    postType !== 'notebook'
      ? `./src/routes/[postType]/${postType}/${slug}`
      : `./src/routes/[postType]/${postType}/thoughts`

  const dataPath = `${postDir}/data.json`
  const dataExists = existsSync(dataPath)
  const postData = dataExists
    ? JSON.parse(await fs.readFile(dataPath, 'utf-8'))
    : {}

  return {
    ...postData,
  }
}
