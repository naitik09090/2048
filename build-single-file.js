const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, 'build');
let html = fs.readFileSync(path.join(buildDir, 'index.html'), 'utf8');

// Inject protection scripts to secure the HTML/JS code (disable right-click, keyboard shortcuts, F12, developer console debugging)
const securityScript = `
  <script>
    // Disable right click context menu to prevent inspecting elements
    document.addEventListener('contextmenu', event => event.preventDefault());

    // Disable F12 and keyboard shortcuts for developer tools
    document.addEventListener('keydown', event => {
      // F12 (123)
      if (event.keyCode === 123) {
        event.preventDefault();
        return false;
      }
      // Ctrl+Shift+I (73), Ctrl+Shift+J (74), Ctrl+Shift+C (67)
      if (event.ctrlKey && event.shiftKey && (event.keyCode === 73 || event.keyCode === 74 || event.keyCode === 67)) {
        event.preventDefault();
        return false;
      }
      // Ctrl+U (85) - View Source
      if (event.ctrlKey && event.keyCode === 85) {
        event.preventDefault();
        return false;
      }
    });

    // Anti-DevTools Debugger Loop to freeze console if F12/Inspect is opened by other means
    setInterval(function() {
      try {
        (function() {}).constructor('debugger')();
      } catch (e) {}
    }, 100);
  </script>
`;
html = html.replace('<head>', '<head>' + securityScript);

// Find and inline CSS
const cssDir = path.join(buildDir, 'static', 'css');
if (fs.existsSync(cssDir)) {
  const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
  if (cssFiles.length > 0) {
    const cssContent = fs.readFileSync(path.join(cssDir, cssFiles[0]), 'utf8');
    
    // Inline images as Base64 in CSS content to make the file truly offline-playable
    let processedCssContent = cssContent;
    const mediaDir = path.join(buildDir, 'static', 'media');
    
    if (fs.existsSync(mediaDir)) {
      const urlRegex = /url\(\.\.\/\.\.\/static\/media\/([^)]+)\)/g;
      let match;
      const replacedUrls = new Map();
      
      while ((match = urlRegex.exec(cssContent)) !== null) {
        const filename = match[1];
        const filePath = path.join(mediaDir, filename);
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath);
          const base64Content = fileContent.toString('base64');
          const ext = path.extname(filename).toLowerCase();
          let mimeType = 'image/gif';
          if (ext === '.svg') mimeType = 'image/svg+xml';
          else if (ext === '.png') mimeType = 'image/png';
          else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
          
          const dataUri = `data:${mimeType};base64,${base64Content}`;
          replacedUrls.set(match[0], `url(${dataUri})`);
        }
      }
      
      for (const [target, replacement] of replacedUrls.entries()) {
        processedCssContent = processedCssContent.split(target).join(replacement);
      }
    }
    
    html = html.replace(/<link href="[^"]+\.css" rel="stylesheet">/, `<style>${processedCssContent}</style>`);
  }
}

// Find and inline JS
const jsDir = path.join(buildDir, 'static', 'js');
if (fs.existsSync(jsDir)) {
  const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js') && !f.includes('.map'));
  if (jsFiles.length > 0) {
    let jsContent = fs.readFileSync(path.join(jsDir, jsFiles[0]), 'utf8');
    
    // Inline JavaScript imported media assets (like try-again.gif) as Base64 Data URIs
    const mediaDir = path.join(buildDir, 'static', 'media');
    if (fs.existsSync(mediaDir)) {
      const jsMediaRegex = /t\.p\+"static\/media\/([^"]+)"/g;
      let jsMatch;
      const replacedJsUrls = new Map();
      
      while ((jsMatch = jsMediaRegex.exec(jsContent)) !== null) {
        const filename = jsMatch[1];
        const filePath = path.join(mediaDir, filename);
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath);
          const base64Content = fileContent.toString('base64');
          const ext = path.extname(filename).toLowerCase();
          let mimeType = 'image/gif';
          if (ext === '.svg') mimeType = 'image/svg+xml';
          else if (ext === '.png') mimeType = 'image/png';
          else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
          
          const dataUri = `data:${mimeType};base64,${base64Content}`;
          replacedJsUrls.set(jsMatch[0], `"${dataUri}"`);
        }
      }
      
      for (const [target, replacement] of replacedJsUrls.entries()) {
        jsContent = jsContent.split(target).join(replacement);
      }
    }

    // Escape any </script> tags in the JS to prevent premature closing of the inline <script> tag
    jsContent = jsContent.replace(/<\/script>/g, '<\\/script>');
    // Remove the original script tag
    html = html.replace(/<script defer="defer" src="[^"]+\.js"><\/script>/, '');
    // Append the inline script before closing body tag
    html = html.replace('</body>', `<script>${jsContent}</script></body>`);
  }
}

// Write the result directly to public/index.html
fs.writeFileSync(path.join(__dirname, 'public', 'index.html'), html);
console.log('Successfully created single-file index.html in public/');
