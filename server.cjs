// Use to create local host
// import http.server
// import socketserver

// PORT = 1337

// Handler = http.server.SimpleHTTPRequestHandler
// Handler.extensions_map.update({
//       ".js": "application/javascript",
// });

// httpd = socketserver.TCPServer(("", PORT), Handler)
// httpd.serve_forever()

// ====================================================

// Require in some of the native stuff that comes with Node
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const port = 4000; // Port number to use
const WHITE = '\x1b[39m'; // Colors for CLI output
const RED = '\x1b[91m';
const GREEN = '\x1b[32m';

// Create the server
http
  .createServer((request, response) => {
    // The requested URL, like http://localhost:8000/file.html => /file.html
    const uri = url.parse(request.url).pathname;

    // Setting up MIME-Type (YOU MAY NEED TO ADD MORE HERE) <--------
    const contentTypesByExtension = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'text/javascript',
      '.json': 'text/json',
      '.svg': 'image/svg+xml',
    };

    // get the /file.html from above and then find it from the current folder
    let filename = path.join(process.cwd(), uri);

    // Check if the requested file exists
    fs.exists(filename, (exists) => {
      // If it doesn't
      if (!exists) {
        // Output a red error pointing to failed request
        console.log(`${RED}FAIL: ${filename}`);
        // Redirect the browser to the 404 page
        filename = path.join(process.cwd(), '/404.html');
        // If the requested URL is a folder, like http://localhost:8000/catpics
      } else if (fs.statSync(filename).isDirectory()) {
        // Output a green line to the console explaining what folder was requested
        console.log(`${GREEN}FLDR: ${WHITE}${filename}`);
        // redirect the user to the index.html in the requested folder
        filename += '/index.html';
      }

      // Assuming the file exists, read it
      fs.readFile(filename, 'binary', (err, file) => {
        // Output a green line to console explaining the file that will be loaded in the browser
        console.log(`${GREEN}FILE: ${WHITE}${filename}`);

        // If there was an error trying to read the file
        if (err) {
          // Put the error in the browser
          response.writeHead(500, { 'Content-Type': 'text/plain' });
          response.write(`${err}\n`);
          response.end();
          return;
        }

        // Otherwise, declare a headers object and a var for the MIME-Type
        const headers = {};
        const contentType = contentTypesByExtension[path.extname(filename)];

        // If the requested file has a matching MIME-Type
        if (contentType) {
          // Set it in the headers
          headers['Content-Type'] = contentType;
        } else {
					headers['Content-Type'] = 'application/javascript';
				}

        // Output the read file to the browser for it to load
        response.writeHead(200, headers);
        response.write(file, 'binary');
        response.end();
      });
    });
  })
  .listen(parseInt(port, 10));

// Confirm running server in terminal
console.log(
  `${WHITE}Static file server running at\n  => http://localhost:${port}/\nCTRL + C to shutdown`,
);
