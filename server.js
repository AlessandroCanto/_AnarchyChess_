const http = require('http');
const fs = require('fs');
const url = require('url');
const socketio = require('socket.io');

const port = process.env.PORT || 5000;

function getFileType(filename) {
  const ext = filename.substring(filename.lastIndexOf('.') + 1);
  const fileTypeMap = {
    html: 'text/html; charset=UTF-8',
    htm: 'text/html; charset=UTF-8',
    js: 'application/javascript; charset=UTF-8',
    css: 'text/css; charset=UTF-8',
    svg: 'image/svg+xml',
    png: 'image/png'
  };

  return fileTypeMap[ext] || 'application/octet-stream';
}

function handler(req, resp) {
  const pathname = url.parse(req.url).pathname;

  if (pathname === '/getport') {
    resp.writeHead(200, { 'Content-Type': 'text/plain' });
    resp.write('' + port);
    resp.end();
  } else if (pathname === '/' || pathname === '/chess') {
    const filename = pathname === '/' ? 'index.html' : 'chess.html';
    resp.writeHead(200, { 'Content-Type': 'text/html' });
    const fileContent = fs.readFileSync(filename);
    resp.write(fileContent);
    resp.end();
  } else {
    const filename = pathname.substring(1);
    const fileType = getFileType(filename);

    fs.readFile(filename, function (err, content) {
      if (err) {
        resp.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
        resp.write(err.message);
        resp.end();
      } else {
        resp.writeHead(200, { 'Content-Type': fileType });
        resp.write(content);
        resp.end();
      }
    });
  }
}

const app = http.createServer(handler);
const io = socketio(app);
app.listen(port);

console.log('HTTP server listening on port ' + port);

// Game logic and socket handling code

const queue = { U: [] };

io.sockets.on('connection', function (sk) {
  console.log('web socket connection received');

  sk.on('setup', function (data) {
    if (data.color === 'U') {
      sk.on('disconnect', function () {
        const index = queue['U'].indexOf(sk);
        console.log('Removing player from queue');
        queue['U'].splice(index, 1);
      });

      if (queue['U'].length >= 2) {
        const player1 = queue['U'].shift();
        const player2 = queue['U'].shift();
        createGame(player1, player2);
      } else {
        queue['U'].push(sk);
      }
    }
  });
});
function createGame(player1, player2) {
  player1.emit('matchfound', { color: 'W' });
  player2.emit('matchfound', { color: 'B' });

  const game = {
    player1: player1,
    player2: player2,
    init: function () {
      this.player1.emit('matchfound', { color: 'W' });
      this.player2.emit('matchfound', { color: 'B' });
    }
  };

  game.init();
}
