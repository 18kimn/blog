import {promises as fs} from "fs"
import type {PageServerLoad} from "./$types"
import path from "path"

export const load: PageServerLoad = async () => {
  return {
    csls: Promise.all(
      [
        {
          name: "Chicago",
          path: "csl/chicago.csl",
        },
        {name: "APA"},
        {name: "ASA", path: "csl/asa.csl"},
        {name: "APSA", path: "csl/apsa.csl"},
      ].map(async (csl) => {
        return {
          template:
            csl.path &&
            (await fs.readFile(
              path.resolve("src/routes/cv/", csl.path),
              "utf-8",
            )),
          name: csl.name,
          path: csl.path,
          key:
            "key" in csl
              ? (csl.key as string)
              : csl.name.toLowerCase(),
        }
      }),
    ),
  }
}
