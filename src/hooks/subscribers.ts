import "dotenv/config"
import {resolve} from "path"
import readline from "readline"
import Database from "better-sqlite3"
import _sodium from "libsodium-wrappers"

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error(
    "DATABASE_URL is not set (check your .env).",
  )
  process.exit(1)
}
const DB_PATH = resolve(
  process.cwd(),
  DATABASE_URL.replace(/^file:/, ""),
)

type Sodium = typeof _sodium

interface Row {
  id: string
  ciphertext: string
  createdAt: number
}

function promptHidden(query: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    const iface = rl as unknown as {
      _writeToOutput: (s: string) => void
    }
    let muted = false
    iface._writeToOutput = (s: string) => {
      if (!muted) process.stdout.write(s)
    }
    process.stdout.write(query)
    muted = true
    rl.question("", (answer) => {
      rl.close()
      process.stdout.write("\n")
      const trimmed = answer.trim()
      if (!trimmed) reject(new Error("No key entered."))
      else resolve(trimmed)
    })
  })
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

async function rotate(sodium: Sodium, force: boolean) {
  const oldKey = force
    ? undefined
    : await promptHidden("Old private key: ")

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

  const sodium = _sodium
  await sodium.ready

  switch (command) {
    case "decrypt":
      decrypt(sodium, await promptHidden("Private key: "))
      break
    case "rotate":
      await rotate(sodium, force)
      break
    default:
      console.error(
        "Usage:\n" +
          "  pnpm subscribers decrypt          (prompts for the private key)\n" +
          "  pnpm subscribers rotate           (prompts for the old key, re-encrypts)\n" +
          "  pnpm subscribers rotate --force   (new key, leaves existing rows behind)",
      )
      process.exit(1)
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
