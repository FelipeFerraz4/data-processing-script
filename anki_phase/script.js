const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");

const inputFilePath = path.join(__dirname, "Rascunho.xlsx");
const outputFile = "anki_output.csv";
const outputFilePath = path.join(__dirname, outputFile);

async function processFile() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(inputFilePath);
  const worksheet = workbook.worksheets[0];

  const linhas = [];

  worksheet.eachRow((row) => {
    const text = row.getCell(1).text.trim();
    if (text) {
      linhas.push(text);
    }
  });

  const ankiData = [];

  // Pula os números e espaços (pegando blocos de 4: número, front, back, vazio)
  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i];
    if (linha.startsWith("Back:")) {
      const front = linhas[i - 1].trim();
      const back = linha.replace("Back:", "").trim();
      ankiData.push([front, back]);
    }
  }

  // Gera o CSV com a primeira linha como cabeçalho
  const csvContent =
    "Front,Back\n" +
    ankiData.map(([front, back]) => `${front},${back}`).join("\n");

  fs.writeFileSync(outputFilePath, csvContent, "utf8");
  console.log("Arquivo CSV gerado com sucesso:", outputFile);
}

processFile().catch(console.error);
