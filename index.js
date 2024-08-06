const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');
var DOTENV = require("dotenv");
// import Main from "./Main";

DOTENV.config();
// Create Express Server
const app = express();

// Configuration
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST||"localhost";
const API_SERVICE_URL = process.env.API_SERVICE_URL || "https://jsonplaceholder.typicode.com";
console.log(PORT, HOST, API_SERVICE_URL);
// Logging
app.use(morgan('dev'));

// Info GET endpoint
app.get('/info', (req, res, next) => {
    res.send('This is a proxy service which proxies to JSONPlaceholder API.');
});

// // Authorization
// app.use('', (req, res, next) => {
//     if (req.headers.authorization) {
//         next();
//     } else {
//         res.sendStatus(403);
//     }
// });

// Proxy endpoints
// Proxy all requests
app.use('/', createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        [`^/`]: '', // Remove / prefix
    },
    onProxyReq: (proxyReq, req, res) => {
        // Add original request headers to the proxied request
        Object.keys(req.headers).forEach(key => {
            if (key !== 'host') { // Avoid setting 'host' header to avoid conflicts
                proxyReq.setHeader(key, req.headers[key]);
            }
        });

        // Optionally set additional headers required by the target service
        proxyReq.setHeader('User-Agent', req.headers['user-agent'] || 'my-proxy');
    },
    onError: (err, req, res) => {
        console.error('Error occurred while proxying request:', err);
        res.status(500).send('An error occurred while proxying the request.');
    }
}));

// Start Proxy
app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
});