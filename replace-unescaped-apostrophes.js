const fs = require("fs");
const path = require("path");

const directoryToScan = "./src"; // Change si nécessaire

const fileExtensions = [".tsx", ".ts"];

function escapeApostrophesInFile(filePath) {
  const originalContent = fs.readFileSync(filePath, "utf8");

  const escapedContent = originalContent.replace(
    /(["'`])((?:\\\1|.)*?)\1/g,
    (match, quote, content) => {
      // Skip backticks (template literals), and double quotes
      if (quote !== "'") return match;

      // If it's a JSX string like "Ajouter l'article"
      if (content.includes("l'article") || content.includes("d'abord") || content.includes("l'ajout")) {
        return `"${content.replace(/'/g, "&apos;")}"`;
      }

      return match;
    }
  );

  if (escapedContent !== originalContent) {
    fs.writeFileSync(filePath, escapedContent, "utf8");
    console.log(`✅ Corrigé : ${filePath}`);
  }
}

function scanDirectory(directoryPath) {
  const items = fs.readdirSync(directoryPath);

  items.forEach((item) => {
    const fullPath = path.join(directoryPath, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      scanDirectory(fullPath);
    } else if (fileExtensions.includes(path.extname(item))) {
      escapeApostrophesInFile(fullPath);
    }
  });
}

// ▶️ Lancer le scan
scanDirectory(directoryToScan);
