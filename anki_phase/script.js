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

  // Pula os números e espaços (pegando blocos de 4: front, back, tradução, vazio)
  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i];
    if (linha.startsWith("Front:")) {
      const front = linha.replace("Front: ", "").trim();
      const back = linhas[i + 1].replace("Back:", "").trim();
      ankiData.push([front, back]);
    } else {
      console.log("Linha não reconhecida:", linha);
    }
    i += 2; // Pula os próximos 3 elementos (back, tradução, vazio)
  }

  // Gera o CSV com a primeira linha como cabeçalho
  const csvContent =
    "Front,Back\n" +
    ankiData.map(([front, back]) => `${front},${back}`).join("\n");

  fs.writeFileSync(outputFilePath, csvContent, "utf8");
  console.log("Arquivo CSV gerado com sucesso:", outputFile);
}

processFile().catch(console.error);
