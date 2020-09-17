#!/usr/bin/env node

const fs = require('fs')
const readline = require('readline')
const Merge = require('package-merge')

const read = (fn) => fs.readFileSync(fn)
const write = (fn, data) => fs.writeFileSync(fn, data)
const ask = (question) => new Promise((resolve) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.question(question, (ans) => {
    rl.close()
    resolve(ans)
  })
})

const [,, ...args] = process.argv

if (args.length < 2) {
  console.warn(`You're trying to merge less than 2 files.. In what universe does that make sense, friend?`)
  process.exit(1)
}

async function go () {
  if (fs.existsSync('package.json')) {
    const res = await ask("package.json already exists - Continue? [Y/n]: ");
    if (res && !res.match(/^y/i)) {
      console.log('Phew, ok I give up')
      process.exit(0)
    }
  }

  const out = args.reduceRight((acc, fn) => {
    if (!acc) {
      return read(fn)
    }

    return Merge(read(fn), acc)
  }, null)

  write('package.json', out)
  console.log('package.json updated')
}

go()
