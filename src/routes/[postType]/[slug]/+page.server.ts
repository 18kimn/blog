import {promises as fs, existsSync} from "fs"

export const prerender = true
export async function load({params}) {
  const {slug, postType} = params
  const postDir = `./src/routes/[postType]/${postType}/${slug}`

  const dataPath = `${postDir}/data.json`
  const dataExists = existsSync(dataPath)
  const postData = dataExists
    ? JSON.parse(await fs.readFile(dataPath, "utf-8"))
    : {}

  return {
    ...postData,
  }
}
