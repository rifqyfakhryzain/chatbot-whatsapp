const fs = require("fs/promises");
const { createWorker } = require("tesseract.js");

async function processImage(imagePath) {
  if (typeof imagePath !== "string" || imagePath.trim() === "") {
    throw new TypeError("OCR failed: image path must be a non-empty string.");
  }

  let imageStats;

  try {
    imageStats = await fs.stat(imagePath);
  } catch (error) {
    if (error.code === "ENOENT" || error.code === "ENOTDIR") {
      throw new Error(`OCR failed: image file not found: ${imagePath}`);
    }

    throw new Error(`OCR failed: unable to access image file: ${error.message}`);
  }

  if (!imageStats.isFile()) {
    throw new Error(`OCR failed: image path is not a file: ${imagePath}`);
  }

  console.info(`OCR processing started: ${imagePath}`);

  let worker;

  try {
    worker = await createWorker("eng");
    const result = await worker.recognize(imagePath);
    const rawText = result.data.text;

    console.info("OCR processing completed.");

    return rawText;
  } catch (error) {
    console.error(`OCR processing failed: ${error.message}`);
    throw new Error(`OCR failed: ${error.message}`, { cause: error });
  } finally {
    if (worker) {
      await worker.terminate();
    }
  }
}

module.exports = {
  processImage,
};
