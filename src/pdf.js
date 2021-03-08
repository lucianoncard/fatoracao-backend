const PDFKit = require('pdfkit');
const fs = require('fs');

const pdf = new PDFKit();

pdf.text('Hello Rocketseat PDF', 30, 30);
pdf.image('uploads/fuvest_2020_q15_enunciado-1612475363273.png', 30, 100, {
  fit: [150, 150]
});
pdf.image('uploads/fuvest_2020_q17_solucao-1612627824258.png', 190, 100, {
  fit: [150, 150]
});
pdf.image('uploads/fuvest_2020_q13_enunciado-1612390383011.png', 350, 100, {
  fit: [150, 150]
});


pdf.pipe(fs.createWriteStream('output.pdf'));
pdf.end();