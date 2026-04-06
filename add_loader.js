const fs = require('fs');
const path = require('path');

const loaderHTML = `
    <!-- Preloader -->
    <div id="preloader">
        <div class="loader-content">
            <img src="public/assets/images/stackly_yellow.webp" alt="Stackly Loading" class="loader-logo">
            <div class="loader-ring"></div>
        </div>
    </div>`;

const files = fs.readdirSync(process.cwd()).filter(f => f.endsWith('.html') && !f.includes('node_modules'));
for(const f of files) {
    let content = fs.readFileSync(f, 'utf8');
    if (!content.includes('id="preloader"')) {
        content = content.replace(/(<body[^>]*>)/i, `$1${loaderHTML}`);
        fs.writeFileSync(f, content);
        console.log(`Updated ${f}`);
    }
}
