const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 8080;

// Get local IP addresses
function getLocalIPs() {
    const interfaces = os.networkInterfaces();
    const ips = [];
    
    for (const name of Object.keys(interfaces)) {
        for (const interface of interfaces[name]) {
            if (interface.family === 'IPv4' && !interface.internal) {
                ips.push(interface.address);
            }
        }
    }
    return ips;
}

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    // Enable CORS for all requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <h1>404 - File Not Found</h1>
                    <p>The file <code>${req.url}</code> was not found.</p>
                    <p><a href="/">Go back to home</a></p>
                `, 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    const ips = getLocalIPs();
    console.log('\n🎬 Dreams and Poems Video Player Server Started!');
    console.log('=' .repeat(50));
    console.log(`📡 Server running on port ${PORT}`);
    console.log('\n📱 Access from any device on your network:');
    console.log(`   • Local: http://localhost:${PORT}`);
    
    ips.forEach(ip => {
        console.log(`   • Network: http://${ip}:${PORT}`);
    });
    
    console.log('\n💡 Tips:');
    console.log('   • Make sure your firewall allows connections on port 8080');
    console.log('   • Use the Network URLs to access from phones, tablets, etc.');
    console.log('   • Press Ctrl+C to stop the server');
    console.log('=' .repeat(50));
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Server shutting down...');
    server.close(() => {
        console.log('✅ Server closed successfully');
        process.exit(0);
    });
});
