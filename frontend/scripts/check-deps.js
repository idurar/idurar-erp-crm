import { readFileSync } from "fs"

const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"))
const deps = { ...packageJson.dependencies, ...packageJson.devDependencies }

console.log("\n📦 Checking dependencies...\n")

const warnings = []
const info = []

// Check for outdated major versions (you can customize these)
const knownUpdates = {
  react: "^18.3.0",
  "react-dom": "^18.3.0",
  antd: "^5.14.0",
}

for (const [pkg, recommendedVersion] of Object.entries(knownUpdates)) {
  if (deps[pkg] && deps[pkg] !== recommendedVersion) {
    info.push(`ℹ️  ${pkg}: current ${deps[pkg]}, recommended ${recommendedVersion}`)
  }
}

// Check for potential security issues (add more as needed)
const securityChecks = ["node-sass"] // Example of deprecated package

for (const pkg of securityChecks) {
  if (deps[pkg]) {
    warnings.push(`⚠️  ${pkg} is deprecated, consider alternatives`)
  }
}

if (warnings.length > 0) {
  console.log("Warnings:")
  warnings.forEach((w) => console.log(w))
  console.log("")
}

if (info.length > 0) {
  console.log("Info:")
  info.forEach((i) => console.log(i))
  console.log("")
}

if (warnings.length === 0 && info.length === 0) {
  console.log("✅ All dependencies look good!\n")
}
