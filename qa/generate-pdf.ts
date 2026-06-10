import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePdf() {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    const htmlPath = path.resolve(__dirname, 'report.html');
    const pdfPath = path.resolve(__dirname, 'report.pdf');
    
    console.log(`Loading report from: ${htmlPath}`);
    
    // Use file:// protocol for local file
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
    
    console.log(`Generating PDF at: ${pdfPath}`);
    
    await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: {
            top: '20px',
            right: '20px',
            bottom: '20px',
            left: '20px'
        }
    });
    
    await browser.close();
    console.log('PDF generated successfully!');
}

generatePdf().catch(err => {
    console.error('Error generating PDF:', err);
    process.exit(1);
});
