import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'

async function run() {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  const indexPath = path.resolve(process.cwd(), 'dist', 'index.html')
  if (!fs.existsSync(indexPath)) {
    console.error('dist/index.html not found. Run `npm run build` first.')
    process.exit(1)
  }

  // Load the built app via file:// to avoid needing a static server
  const url = 'file://' + indexPath
  console.log('Opening', url)
  await page.goto(url, { waitUntil: 'load' })

  // Inject axe-core source
  const require = createRequire(import.meta.url)
  const axePath = require.resolve('axe-core/axe.min.js')
  const axeSource = fs.readFileSync(axePath, 'utf8')
  await page.addScriptTag({ content: axeSource })

  // Run axe
  const results = await page.evaluate(async () => {
    // @ts-ignore
    return await axe.run()
  })

  const outPath = path.resolve(process.cwd(), 'axe-report.json')
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2))
  console.log('Saved axe report to', outPath)
  console.log('Violations:', results.violations.length)

  await browser.close()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
