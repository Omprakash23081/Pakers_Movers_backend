const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Changes the cache location for Puppeteer to a local path.
  // This helps maintain consistency between build and runtime on platforms like Render.
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
