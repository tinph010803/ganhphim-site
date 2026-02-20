import fs from 'fs/promises'
import path from 'path'
import {fileURLToPath} from 'url'
import JavaScriptObfuscator from 'javascript-obfuscator'

// Lấy __dirname từ ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const inputFiles = [
    path.join(__dirname, '../utils/antiClone.js'),
]

const outputFile = path.join(__dirname, '../utils/antiClone.obf.js')

try {
    let combinedCode = ''

    for (const file of inputFiles) {
        const content = await fs.readFile(file, 'utf8')
        combinedCode += '\n' + content
    }

    const obfuscated = JavaScriptObfuscator.obfuscate(combinedCode, {
        rotateStringArray: true,
        stringArray: true,
        stringArrayThreshold: 1,
        stringArrayEncoding: ['rc4'],
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.75,
        stringArrayShuffle: true,
        splitStrings: true,
        simplify: true,
        // disableConsoleOutput: true,
    })

    await fs.writeFile(outputFile, obfuscated.getObfuscatedCode(), 'utf8')
    console.log(`✅ Obfuscated output written to: ${outputFile}`)
} catch (err) {
    console.error('❌ Failed to obfuscate:', err)
}
