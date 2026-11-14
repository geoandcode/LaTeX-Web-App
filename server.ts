import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // LaTeX Compilation API Route using Tectonic engine
  app.post('/api/compile-latex', async (req, res) => {
    const tmpDir = path.join(process.cwd(), 'tmp');
    const uniqueId = Date.now();
    const filename = req.body.filename || 'report';
    const texFile = path.join(tmpDir, `${filename}_${uniqueId}.tex`);
    const pdfFile = path.join(tmpDir, `${filename}_${uniqueId}.pdf`);

    try {
      const { latexCode } = req.body;
      if (!latexCode) {
        return res.status(400).json({ error: 'No LaTeX source provided' });
      }

      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }

      // Preprocess latexCode to ensure 100% robust Tectonic compilation
      let processedLatex = latexCode;

      // 1. Replace figure blocks containing [IMAGE:...] with clean TeX boxes to avoid float option errors ('I')
      processedLatex = processedLatex.replace(/\\begin\{figure\}([\s\S]*?)\\end\{figure\}/gs, (_: string, content: string) => {
        const capMatch = content.match(/\\caption\{(.*?)\}/);
        const caption = capMatch ? capMatch[1] : 'Figure';
        return `
          \\begin{center}
          \\fbox{\\parbox{0.85\\textwidth}{\\centering\\itshape\\small [Figure: ${caption}]}}
          \\end{center}
        `;
      });

      // 2. Clean up institute and author macros (preventing \\ inside commands and undefined control sequences)
      processedLatex = processedLatex
        .replace(/\\institute\{(.*?)\}/gs, (_: string, inst: string) => `\\institute{${inst.replace(/\\\\/g, ', ').replace(/\\and/g, ' and ')}}`)
        .replace(/\\author\{(.*?)\}/gs, (_: string, auth: string) => `\\author{${auth.replace(/\\\\/g, ', ').replace(/\\and/g, ' and ')}}`);

      // 3. Escape unescaped ampersands in section titles and captions
      processedLatex = processedLatex
        .replace(/\\section\{(.*?)\}/gs, (_: string, title: string) => `\\section{${title.replace(/&/g, '\\&')}}`)
        .replace(/\\subsection\{(.*?)\}/gs, (_: string, subtitle: string) => `\\subsection{${subtitle.replace(/&/g, '\\&')}}`)
        .replace(/\\caption\{(.*?)\}/gs, (_: string, cap: string) => `\\caption{${cap.replace(/&/g, '\\&')}}`);

      // Wrap in standard article preamble with safe macro fallbacks for \institute
      let fullLatex = processedLatex;
      if (!fullLatex.includes('\\documentclass')) {
        fullLatex = `
          \\documentclass[11pt,a4paper]{article}
          \\usepackage[utf8]{inputenc}
          \\usepackage{amsmath,amssymb,amsfonts}
          \\usepackage{graphicx}
          \\providecommand{\\institute}[1]{\\par\\textit{#1}\\par}
          \\begin{document}
          ${processedLatex}
          \\end{document}
        `;
      } else {
        fullLatex = fullLatex.replace(
          /\\begin\{document\}/,
          `\\providecommand{\\institute}[1]{\\par\\textit{#1}\\par}\n\\begin{document}`
        );
      }

      fs.writeFileSync(texFile, fullLatex, 'utf8');

      // Execute Tectonic compilation
      await execAsync(`tectonic -o ${tmpDir} ${texFile}`);

      if (fs.existsSync(pdfFile)) {
        res.download(pdfFile, `${filename}.pdf`, () => {
          // Cleanup temp files
          try {
            if (fs.existsSync(texFile)) fs.unlinkSync(texFile);
            if (fs.existsSync(pdfFile)) fs.unlinkSync(pdfFile);
            ['aux', 'log', 'out', 'toc'].forEach(ext => {
              const auxPath = path.join(tmpDir, `${filename}_${uniqueId}.${ext}`);
              if (fs.existsSync(auxPath)) fs.unlinkSync(auxPath);
            });
          } catch (e) {}
        });
      } else {
        res.status(500).json({ error: 'Tectonic executed but PDF output was not generated.' });
      }
    } catch (err: any) {
      console.error('LaTeX compilation error:', err);
      // Cleanup
      try {
        if (fs.existsSync(texFile)) fs.unlinkSync(texFile);
        if (fs.existsSync(pdfFile)) fs.unlinkSync(pdfFile);
      } catch (e) {}
      res.status(500).json({ error: 'LaTeX compilation failed: ' + (err?.message || String(err)) });
    }
  });

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
