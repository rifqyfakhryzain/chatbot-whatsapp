const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");
const { createWorker, PSM } = require("tesseract.js");

const imagePath = path.resolve(__dirname, "../assets/ocr/Jadwal.jpeg");

async function verifyInputImage() {
  let imageStats;

  try {
    imageStats = await fs.stat(imagePath);
  } catch (error) {
    if (error.code === "ENOENT" || error.code === "ENOTDIR") {
      throw new Error(`Input image not found: ${imagePath}`);
    }

    throw new Error(`Unable to access input image: ${error.message}`);
  }

  if (!imageStats.isFile()) {
    throw new Error(`Input image path is not a file: ${imagePath}`);
  }
}

async function createPreprocessedImage() {
  try {
    return await sharp(imagePath)
      .grayscale()
      .resize({
        width: 3200,
        height: 1312,
        kernel: sharp.kernel.lanczos3,
      })
      .png()
      .toBuffer();
  } catch (error) {
    throw new Error(`Preprocessing failed: ${error.message}`, { cause: error });
  }
}

async function compareOCR() {
  await verifyInputImage();
  const preprocessedImage = await createPreprocessedImage();

  console.log("=================================");
  console.log("OCR PREPROCESSING COMPARISON");
  console.log("=================================\n");

  let worker;

  try {
    worker = await createWorker("eng");
    await worker.setParameters({
      tessedit_pageseg_mode: PSM.AUTO,
      preserve_interword_spaces: "1",
    });

    const originalResult = await worker.recognize(imagePath);
    const preprocessedResult = await worker.recognize(preprocessedImage);

    console.log("[ORIGINAL]");
    console.log(originalResult.data.text);
    console.log("\n=================================");
    console.log("[GRAYSCALE + 2X RESIZE]");
    console.log(preprocessedResult.data.text);
    console.log("\n=================================");
    console.log("COMPARISON COMPLETE");
    console.log("=================================");
  } catch (error) {
    throw new Error(`OCR failed: ${error.message}`, { cause: error });
  } finally {
    if (worker) {
      await worker.terminate();
    }
  }
}

compareOCR().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
