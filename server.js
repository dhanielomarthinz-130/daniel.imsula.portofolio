/**
 * Developer Portfolio & NoteJS Server
 * Built with Node.js standard HTTP module (Zero-dependency, blazing fast & robust)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');

// MIME types mapping
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// Helper: Ensure directory exists
function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Helper: Read JSON file safely
function readJsonFile(filePath, defaultData = []) {
  try {
    if (!fs.existsSync(filePath)) {
      return defaultData;
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
    return defaultData;
  }
}

// Helper: Write JSON file safely
function writeJsonFile(filePath, data) {
  try {
    ensureDirExists(path.dirname(filePath));
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err.message);
    return false;
  }
}

// Helper: Parse JSON body
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      // Safeguard against large payloads (> 2MB)
      if (body.length > 2 * 1024 * 1024) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

// Helper: Send JSON response
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

// Helper: Serve static file
function serveStaticFile(req, res, filePath) {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
}

// Create HTTP Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // Enable CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  // --- REST API ROUTES ---
  if (pathname.startsWith('/api/')) {
    const portfolioFile = path.join(DATA_DIR, 'portfolio.json');
    const notesFile = path.join(DATA_DIR, 'notes.json');
    const messagesFile = path.join(DATA_DIR, 'messages.json');

    // 1. Health check
    if (pathname === '/api/health' && method === 'GET') {
      return sendJson(res, 200, {
        status: 'online',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      });
    }

    // 2. Portfolio Profile Data
    if (pathname === '/api/profile' && method === 'GET') {
      const data = readJsonFile(portfolioFile, {});
      return sendJson(res, 200, { success: true, data });
    }

    // 3. Projects list
    if (pathname === '/api/projects' && method === 'GET') {
      const data = readJsonFile(portfolioFile, {});
      const category = parsedUrl.query.category;
      let projects = data.projects || [];
      if (category && category !== 'all') {
        projects = projects.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
      }
      return sendJson(res, 200, { success: true, count: projects.length, data: projects });
    }

    // 4. Note.js CRUD Endpoints
    // GET /api/notes
    if (pathname === '/api/notes' && method === 'GET') {
      const notes = readJsonFile(notesFile, []);
      return sendJson(res, 200, { success: true, count: notes.length, data: notes });
    }

    // POST /api/notes
    if (pathname === '/api/notes' && method === 'POST') {
      try {
        const body = await parseRequestBody(req);
        if (!body.title || !body.content) {
          return sendJson(res, 400, { success: false, error: 'Title and content are required' });
        }

        const notes = readJsonFile(notesFile, []);
        const newNote = {
          id: 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          title: body.title.trim(),
          content: body.content.trim(),
          tag: body.tag ? body.tag.trim() : 'General',
          type: body.type || 'text', // 'text' | 'code' | 'markdown'
          language: body.language || 'javascript',
          pinned: !!body.pinned,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        notes.unshift(newNote);
        writeJsonFile(notesFile, notes);
        return sendJson(res, 201, { success: true, data: newNote, message: 'Note created successfully' });
      } catch (err) {
        return sendJson(res, 400, { success: false, error: err.message });
      }
    }

    // PUT /api/notes/:id
    if (pathname.startsWith('/api/notes/') && method === 'PUT') {
      const noteId = pathname.replace('/api/notes/', '');
      try {
        const body = await parseRequestBody(req);
        const notes = readJsonFile(notesFile, []);
        const index = notes.findIndex(n => n.id === noteId);

        if (index === -1) {
          return sendJson(res, 404, { success: false, error: 'Note not found' });
        }

        notes[index] = {
          ...notes[index],
          ...body,
          id: noteId,
          updatedAt: new Date().toISOString()
        };

        writeJsonFile(notesFile, notes);
        return sendJson(res, 200, { success: true, data: notes[index], message: 'Note updated successfully' });
      } catch (err) {
        return sendJson(res, 400, { success: false, error: err.message });
      }
    }

    // DELETE /api/notes/:id
    if (pathname.startsWith('/api/notes/') && method === 'DELETE') {
      const noteId = pathname.replace('/api/notes/', '');
      const notes = readJsonFile(notesFile, []);
      const filtered = notes.filter(n => n.id !== noteId);

      if (filtered.length === notes.length) {
        return sendJson(res, 404, { success: false, error: 'Note not found' });
      }

      writeJsonFile(notesFile, filtered);
      return sendJson(res, 200, { success: true, message: 'Note deleted successfully' });
    }

    // 5. Contact Form Submission
    if (pathname === '/api/contact' && method === 'POST') {
      try {
        const body = await parseRequestBody(req);
        if (!body.name || !body.email || !body.message) {
          return sendJson(res, 400, { success: false, error: 'Name, email, and message are required fields' });
        }

        const messages = readJsonFile(messagesFile, []);
        const newMessage = {
          id: 'msg_' + Date.now(),
          name: body.name.trim(),
          email: body.email.trim(),
          subject: body.subject ? body.subject.trim() : 'No Subject',
          message: body.message.trim(),
          receivedAt: new Date().toISOString()
        };

        messages.unshift(newMessage);
        writeJsonFile(messagesFile, messages);

        return sendJson(res, 201, {
          success: true,
          message: `Terima kasih ${newMessage.name}! Pesan Anda telah diterima dan akan segera direspons.`
        });
      } catch (err) {
        return sendJson(res, 400, { success: false, error: err.message });
      }
    }

    // Unknown API route
    return sendJson(res, 404, { success: false, error: 'API endpoint not found' });
  }

  // --- STATIC FILES SERVING ---
  let safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const fullPath = path.join(PUBLIC_DIR, safePath);

  // Security check: prevent directory traversal
  if (!fullPath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('403 Forbidden');
  }

  // Check if file exists or try index.html
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    serveStaticFile(req, res, fullPath);
  } else {
    // Single page fallback to index.html
    const fallbackPath = path.join(PUBLIC_DIR, 'index.html');
    if (fs.existsSync(fallbackPath)) {
      serveStaticFile(req, res, fallbackPath);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
    }
  }
});

// Initialize data folders and sample files if needed
ensureDirExists(DATA_DIR);
ensureDirExists(PUBLIC_DIR);

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Developer Portfolio & NoteJS Server is running!`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`📦 REST API: http://localhost:${PORT}/api/profile`);
  console.log(`======================================================\n`);
});
