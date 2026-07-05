import fs from 'fs'
import path from 'path'

export async function GET() {
  const html = fs.readFileSync(path.join(process.cwd(), 'public/patterns-template.html'), 'utf-8')
  const css = fs.readFileSync(path.join(process.cwd(), 'public/global-patterns.css'), 'utf-8')

  const finalHtml = html
    .replace('<link rel="stylesheet" href="global-patterns.css">', `<style>${css}</style>`)
    .replace('<script src="https://cdn.tailwindcss.com"></script>', '')

  return new Response(finalHtml, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}