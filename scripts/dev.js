const { spawn, execFileSync } = require("child_process");

const viewerTitles = [
  "WhatsApp QR",
  "WhatsApp Messages",
  "WhatsApp Connection",
];

let nodemonProcess;

function closeViewerTerminals() {
  for (const title of viewerTitles) {
    try {
      execFileSync("taskkill", ["/FI", `WINDOWTITLE eq ${title}`, "/T", "/F"], {
        stdio: "ignore",
      });
    } catch {
      // Ignore if the terminal is not running.
    }
  }
}

function startViewers() {
  const viewerProcess = spawn("node", ["scripts/open-viewers.js"], {
    stdio: "inherit",
  });

  viewerProcess.on("error", (error) => {
    console.error("Failed to start WhatsApp viewers:", error.message);
  });
}

function startNodemon() {
  const nodemonPath = require.resolve("nodemon/bin/nodemon.js");

  nodemonProcess = spawn(process.execPath, [nodemonPath, "src/server.js"], {
    stdio: "inherit",
  });

  nodemonProcess.on("error", (error) => {
    console.error("Failed to start Nodemon:", error.message);
  });
}

function cleanup() {
  console.log("\nStopping ChatBot WhatsApp development environment...");

  closeViewerTerminals();

  if (nodemonProcess && !nodemonProcess.killed) {
    nodemonProcess.kill();
  }

  process.exit(0);
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

closeViewerTerminals();

startViewers();
startNodemon();
