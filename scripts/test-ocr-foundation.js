const path = require("path");
const { processImage } = require("../src/services/ocr.service");

const imagePath = path.resolve(
  process.argv[2] || path.join(__dirname, "../assets/ocr/Jadwal.jpeg"),
);

async function runOCR() {
  console.log("=================================");
  console.log("OCR FOUNDATION RESULT");
  console.log("=================================\n");
  console.log(`Image: ${imagePath}\n`);

  try {
    const rawText = await processImage(imagePath);

    console.log("\n=================================");
    console.log("RAW OCR TEXT");
    console.log("=================================\n");
    console.log(rawText);
    console.log("\n=================================");
    console.log("OCR COMPLETE");
    console.log("=================================");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

runOCR();
