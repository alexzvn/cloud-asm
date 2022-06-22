import { spawn } from 'child_process'

const output = (proc) => {
  proc.stdout.on('data', (data) => {
    console.log(data.toString())
  })

  proc.stderr.on('data', (data) => {
    console.error(data.toString())
  })
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

