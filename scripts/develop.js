import { spawn } from 'child_process'

const output = (proc) => {
  proc.stdout.pipe(process.stdout)
  proc.stderr.pipe(process.stderr)
}

const styles = [
  'tailwindcss',
  '-i',
  'style.css',
  '-o',
  './public/style.css',
  '-w'
]

const nodemon = [
  'nodemon',
  '-q',
  'main.js'
]

output(
  spawn('npx', styles, { shell: true })
)

output(
  spawn('npx', nodemon, { shell: true })
)

