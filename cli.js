const fs = require('fs')
const readline = require('readline')
const Merge = require('package-merge')

const read = (fn) => fs.readFileSync(fn)
const write = (fn, data) => fs.writeFileSync(fn, data)

const [,, ...args] = process.argv

if (args.length < 2) {
  console.warn(`You're trying to merge less than 2 files.. In what universe does that make sense, friend?`)
  process.exit(1)
}

if (fs.existsSync('package.json')) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.question("package.json already exists! Do you really wanna blow it the crap away? [Y/n]\n", (ans) => {
    if (!ans || ans.match(/^y/i)) {
      go()
    } else {
      console.log('Phew, ok I give up')
      process.exit(0)
    }
    rl.close()
  })
} else {
  go()
}

function go () {
  const out = args.reduceRight((acc, fn) => {
    if (!acc) {
      return read(fn)
    }

    return Merge(read(fn), acc)
  }, null)

  write('package.json', out)
  console.log('package.json updated')
}
