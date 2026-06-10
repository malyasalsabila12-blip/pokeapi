import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function runTests() {
    const timestamp = new Date().toISOString().split('T')[0];
    const reportDir = path.join(rootDir, 'reports');
    
    if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir);
    }

    const htmlReport = path.join(reportDir, `${timestamp}.html`);
    const jsonReport = path.join(reportDir, `${timestamp}.json`);
    const latestHtml = path.join(__dirname, 'report.html');

    console.log('--- Running Newman Tests ---');
    try {
        execSync(`newman run qa/pokeapi.postman_collection.json -e qa/pokeapi.postman_environment.json -r cli,htmlextra,json --reporter-htmlextra-export "${htmlReport}" --reporter-json-export "${jsonReport}"`, { stdio: 'inherit' });
        
        // Copy to latest for PDF generation
        fs.copyFileSync(htmlReport, latestHtml);
        
        console.log('--- Generating PDF ---');
        execSync('npx tsx qa/generate-pdf.ts', { stdio: 'inherit' });
        
        console.log(`\n✅ Tests completed! Reports saved to /reports/${timestamp}.html and .json`);
    } catch (error) {
        console.error('❌ Newman run failed, but reports might have been generated.');
    }
}

runTests();
