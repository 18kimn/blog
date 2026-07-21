import {fileURLToPath} from "url"
import {dirname, resolve} from "path"
import Database from "better-sqlite3"
import _sodium from "libsodium-wrappers"

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = resolve(__dirname, "../../board.db")

type Sodium = typeof _sodium

interface Row {
  id: string
  ciphertext: string
  createdAt: number
}

const b64 = (sodium: Sodium, bytes: Uint8Array) =>
  sodium.to_base64(bytes, sodium.base64_variants.ORIGINAL)

const fromB64 = (sodium: Sodium, text: string) =>
  sodium.from_base64(
    text.trim(),
    sodium.base64_variants.ORIGINAL,
  )

function open(
  sodium: Sodium,
  privateKey: string,
  row: Row,
) {
  const key = fromB64(sodium, privateKey)
  const opened = sodium.crypto_box_seal_open(
    fromB64(sodium, row.ciphertext),
    sodium.crypto_scalarmult_base(key),
    key,
  )
  return sodium.to_string(opened)
}

function decrypt(sodium: Sodium, privateKey: string) {
  const db = new Database(DB_PATH, {readonly: true})
  const rows = db
    .prepare(
      "SELECT id, ciphertext, createdAt FROM Subscriber ORDER BY createdAt ASC",
    )
    .all() as Row[]

  for (const row of rows) {
    try {
      console.log(
        JSON.stringify(
          JSON.parse(open(sodium, privateKey, row)),
        ),
      )
    } catch {
      console.error(
        `Could not decrypt row ${row.id} (createdAt=${row.createdAt})`,
      )
    }
  }
  console.error(`\n${rows.length} subscriber(s).`)
}

function rotate(
  sodium: Sodium,
  oldKey: string | undefined,
  force: boolean,
) {
  if (!oldKey && !force) {
    console.error(
      "rotate needs the old private key (to re-encrypt existing subscribers),\n" +
        "or --force to generate a new key and leave existing rows behind.",
    )
    process.exit(1)
  }

  const {publicKey, privateKey} =
    sodium.crypto_box_keypair()

  const db = new Database(DB_PATH)
  const rows = db
    .prepare(
      "SELECT id, ciphertext, createdAt FROM Subscriber",
    )
    .all() as Row[]

  if (oldKey) {
    const update = db.prepare(
      "UPDATE Subscriber SET ciphertext = ? WHERE id = ?",
    )
    let reencrypted = 0
    const run = db.transaction(() => {
      for (const row of rows) {
        const plaintext = open(sodium, oldKey, row)
        const sealed = sodium.crypto_box_seal(
          sodium.from_string(plaintext),
          publicKey,
        )
        update.run(b64(sodium, sealed), row.id)
        reencrypted++
      }
    })
    run()
    console.error(
      `Re-encrypted ${reencrypted} subscriber(s) under the new key.`,
    )
  } else {
    console.error(
      `--force: generated a new key WITHOUT re-encrypting ${rows.length} existing row(s).\n` +
        "Those rows are now unreadable — keep the old private key if you still need them.",
    )
  }

  console.error(
    "\nUpdate .env with the new public key, then rebuild:",
  )
  console.log(
    `PUBLIC_STAY_IN_TOUCH_KEY=${b64(sodium, publicKey)}`,
  )
  console.error(
    "\nStore the new private key somewhere safe:",
  )
  console.log(`PRIVATE=${b64(sodium, privateKey)}`)
}

async function main() {
  const [command, ...rest] = process.argv.slice(2)
  const force = rest.includes("--force")
  const key = rest.find((arg) => !arg.startsWith("--"))

  const sodium = _sodium
  await sodium.ready

  switch (command) {
    case "decrypt":
      if (!key) {
        console.error(
          "Usage: pnpm subscribers decrypt <private-key>",
        )
        process.exit(1)
      }
      decrypt(sodium, key)
      break
    case "rotate":
      rotate(sodium, key, force)
      break
    default:
      console.error(
        "Usage:\n" +
          "  pnpm subscribers decrypt <private-key>\n" +
          "  pnpm subscribers rotate <old-private-key>\n" +
          "  pnpm subscribers rotate --force",
      )
      process.exit(1)
  }
}

main()
