const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/screenshot', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: 'URL not provided' });
  }

  try {
    const screenshotData = await takeScreenshot(url);
    const imageBase64 = screenshotData.toString('base64');

    const responseData = {
      image: `data:image/png;base64,${imageBase64}`,
    };

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ error: `Failed to capture screenshot: ${error.message}` });
  }
});

async function takeScreenshot(url, width = 423, height = 866) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.setViewport({ width, height });
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(2000); // Aguarda 2 segundos (ajuste conforme necessário)

    const screenshotData = await page.screenshot();
    return screenshotData;
  } finally {
    await browser.close();
  }
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
