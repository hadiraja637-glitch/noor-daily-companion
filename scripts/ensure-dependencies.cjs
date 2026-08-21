const { createRequire } = require('node:module')
const { spawnSync } = require('node:child_process')

const requireFromProject = createRequire(process.cwd() + '/package.json')
const required = [
  ['react', 'react'],
  ['react-dom/client', 'react-dom'],
  ['react-router', 'react-router'],
  ['lucide-react', 'lucide-react'],
  ['vite', 'vite'],
]

const missing = []
for (const [entry, packageName] of required) {
  try {
    requireFromProject(entry)
  } catch {
    if (!missing.includes(packageName)) missing.push(packageName)
  }
}

if (missing.length === 0) process.exit(0)

console.log(`Noor dependency repair: installing missing package(s): ${missing.join(', ')}`)
const result = spawnSync(
  process.platform === 'win32' ? 'npm.cmd' : 'npm',
  ['install', ...missing, '--no-audit', '--no-fund'],
  { stdio: 'inherit', shell: false },
)

if (result.error) {
  console.error(`Could not start npm: ${result.error.message}`)
  process.exit(1)
}
process.exit(result.status ?? 1)
