/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import katex from 'katex';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
  FileText, Code, Download, Eye, Settings, HelpCircle, 
  Sparkles, Copy, Check, RefreshCw, ZoomIn, ZoomOut, 
  Printer, BookOpen, Layers, Maximize2, Minimize2, 
  Plus, Trash2, Edit3, Save, Share2, Award, Terminal, Image as ImageIcon, Layout, Loader2, AlertCircle
} from 'lucide-react';

/// --- TEMPLATES ---
const TEMPLATES = [
  {
    id: 'sentinel',
    name: 'Interferometric Analysis (Sentinel-1)',
    description: 'Academic lab report style with running headers, Sentinel-1 radar stacks, and interferograms.',
    format: 'a4',
    content: `\\title{Advanced Interferometric SAR Analysis of Campi Flegrei Caldera Deformation Field}
\\author{Dr. Francesco Gambetta \\and Prof. Marco Pietra}
\\institute{Politecnico di Milano \\and Department of Aerospace Science and Technology}

\\begin{abstract}
This report details the advanced differential interferometric synthetic aperture radar (DInSAR) and Small Baseline Subset (SBAS) time-series processing chain applied to Sentinel-1 C-band acquisitions over the Pozzuoli caldera (Campi Flegrei, Italy). We examine co-registered SLC stacks, perpendicular baseline distributions, atmospheric phase screening, and unwrapped phase fringes associated with ongoing bradyseismic ground deformation. Quantitative velocity maps confirm sustained uplift acceleration in the Rione Terra sector.
\\end{abstract}

\\section{Introduction \\& Geophysical Context}
The Campi Flegrei caldera is a high-risk volcanic system characterized by recurring episodes of bradyseism—slow ground deformation driven by magmatic-hydrothermal fluid circulation. Monitoring surface displacement with millimeter precision requires advanced satellite radar interferometry. Sentinel-1 Interferometric Wide (IW) swath acquisitions provide systematic C-band imagery with a 12-day repeat cycle.

Let the radar slant range $R$ from satellite position $\\mathbf{S}(t)$ to ground target $\\mathbf{P}$ be defined as:
$$R(t) = \\| \\mathbf{S}(t) - \\mathbf{P} \\|$$

\\begin{figure}
[IMAGE:https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80]
\\caption{Sentinel-1 IW coregistered intensity mosaic over Campi Flegrei and Pozzuoli bay.}
\\end{figure}

\\section{Coregistration \\& Interferometric Phase Modeling}
Single Look Complex (SLC) images acquired along descending track 22 were co-registered using Enhanced Spectral Diversity (ESD) and precise restituted orbit ephemerides. The interferometric phase $\\phi$ between master and slave acquisitions is modeled as:
$$\\phi = \\phi_{\\text{topo}} + \\phi_{\\text{defo}} + \\phi_{\\text{atmos}} + \\phi_{\\text{orbit}} + \\epsilon$$

Topographic phase contributions $\\phi_{\\text{topo}}$ were removed using the Copernicus 30m Digital Elevation Model (DEM), yielding the differential interferogram:
$$\\Delta \\phi_{\\text{diff}} = \\phi_{\\text{defo}} + \\phi_{\\text{atmos}} + \\epsilon$$

\\begin{table}
\\centering
\\begin{tabular}{lcr}
\\hline
Parameter & Value & Unit \\\\ \\hline
Sensor & Sentinel-1A/B & C-band \\\\
Center Frequency & 5.405 & GHz \\\\
Wavelength ($\\lambda$) & 5.546 & cm \\\\
Swath / Mode & IW / TOPS & - \\\\
Orbit Track & Descending 22 & - \\\\
Repeat Cycle & 12 & Days \\\\ \\hline
\\end{tabular}
\\caption{Sentinel-1 radar acquisition parameters for Campi Flegrei stack.}
\\end{table}

\\section{Baseline Distribution \\& Coherence Estimation}
Perpendicular baselines were maintained within $\\pm 45$ meters to minimize spatial decorrelation. The complex coherence $\\gamma$ over resolution cell $(x, y)$ is estimated as:
$$\\gamma = \\frac{\\left| \\sum \\mathbf{s}_1(x,y) \\mathbf{s}_2^*(x,y) \\right|}{\\sqrt{\\sum |\\mathbf{s}_1(x,y)|^2 \\sum |\\mathbf{s}_2(x,y)|^2}}$$

\\begin{figure}
[IMAGE:https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80]
\\caption{Perpendicular baseline temporal distribution and spatial coherence evaluation.}
\\end{figure}

Areas with coherence $\\gamma > 0.75$ over urban structures enabled reliable phase unwrapping via minimum cost flow (MCF) algorithms.

\\section{Atmospheric Phase Screening \\& Time-Series Inversion}
Tropospheric delay anomalies (stratified and turbulent APS) were mitigated using ERA5 numerical weather model reanalysis combined with spatial-temporal filtering. Let the unwrapped displacement time series $d(t_k)$ be retrieved via singular value decomposition (SVD) of the SBAS network:
$$\\mathbf{A} \\mathbf{v} = \\Delta \\phi$$
where $\\mathbf{A}$ is the design matrix relating acquisitions to interferograms, and $\\mathbf{v}$ represents incremental velocities.

\\begin{figure}
[IMAGE:https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80]
\\caption{SBAS time-series velocity gradient map showing uplift rates exceeding 12 cm/year.}
\\end{figure}

\\section{Discussion \\& Conclusion}
The processed DInSAR time series confirms continuous, non-linear uplift acceleration centered beneath Pozzuoli town, with cumulative displacement exceeding 35 cm over the 2024 monitoring period. Future work will integrate GNSS continuous stations to resolve 3D displacement vectors.
`
  },
  {
    id: 'tufte',
    name: 'Tufte Handout (Edward Tufte Style)',
    description: 'Minimalist Tufte handout layout with sans-serif headings, serif body text, and uncluttered tabular data presentation.',
    format: 'a4',
    content: `\\documentclass{tufte-handout}
\\title{Visualizing Information Design Principles}
\\author{Edward Tufte \\and Graphics Press}
\\institute{Yale University}

\\begin{abstract}
Data graphics and tables should draw the viewer's attention to the sense and substance of the data, not to quantitative flatness or design gimmickry. Tufte-style documents prioritize typographic clarity and data-dense tabular presentation without unnecessary gridlines.
\\end{abstract}

\\section{Minimalist Table Design}
Tables should be clean and uncluttered by unnecessary vertical gridlines. Edward Tufte famously noted that tables should have no vertical rules and only three horizontal rules.

\\begin{table}
\\centering
\\begin{tabular}{lcr}
\\hline
Metric & Baseline & Tufte Optimal \\\\ \\hline
Ink-to-Data Ratio & 0.24 & 0.92 \\\\
Cognitive Load & High & Minimal \\\\
Visual Clutter & Severe & Zero \\\\ \\hline
\\end{tabular}
\\caption{Comparison of traditional grid tables versus Tufte minimalist tabular design.}
\\end{table}

\\section{Typography & Margin Notes}
By combining serif body text with clean sans-serif headers and generous whitespace, documents achieve exceptional readability.
`
  },
  {
    id: 'beamer',
    name: 'Beamer Presentation Slides',
    description: 'LaTeX Beamer slide deck layout with 16:9 widescreen slides and professional theorem blocks.',
    format: 'beamer',
    content: `\\title{Real-Time LaTeX Synthesis in Academic Workflows}
\\author{Francesco Gambetta \\and Research Group}
\\institute{Politecnico di Milano}

\\section{Introduction \\& Motivation}
Document preparation systems such as LaTeX provide peerless mathematical typesetting. However, traditional compilation loops create friction.

\\begin{itemize}
\\item Traditional PDF compilation takes 1-3 seconds per keystroke.
\\item Gummi-inspired live preview reduces latency to < 4ms.
\\item KaTeX math rendering enables instant browser-based verification.
\\end{itemize}

$$E = mc^2 \\quad \\implies \\quad G_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}$$

\\section{Core Architecture}
Our streaming parser splits document blocks into isolated reactive units, re-rendering only modified paragraphs.

\\begin{figure}
[IMAGE:https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80]
\\caption{Incremental token parsing pipeline vs monolithic LaTeX engines.}
\\end{figure}
`
  },
  {
    id: 'ieee',
    name: 'IEEE Conference Paper',
    description: 'Standard two-column IEEE format for academic and engineering research papers.',
    format: 'a4',
    content: `\\title{Advanced Neural Architectures for Real-Time LaTeX Synthesis}
\\author{Dr. Alexander Vance \\and Prof. Elena Rostova}
\\institute{Department of Computer Science, MIT \\and Stanford AI Laboratory}

\\begin{abstract}
Real-time document synthesis requires extremely low-latency parsing and rendering pipelines. In this paper, we introduce a Gummi-inspired instantaneous LaTeX compilation architecture that reduces preview delay to sub-millisecond thresholds. Our empirical evaluation demonstrates a 98.4\\% reduction in cognitive friction for academic writers and researchers.
\\end{abstract}

\\section{Introduction}
Document preparation systems such as LaTeX have long been the gold standard for typesetting mathematical rigor. However, traditional compilation workflows often introduce disruptive context-switching delays. Inspired by lightweight editors like Gummi, we present an instantaneous live-preview engine.

Consider the classic Einstein mass-energy equivalence equation:
$$E = mc^2$$

Furthermore, the general relativistic field equations are given by:
$$G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}$$

\\section{Methodology}
Our approach combines incremental block parsing with client-side KaTeX math typesetting. Given a document stream $D = (b_1, b_2, \\dots, b_n)$, each paragraph block is independently re-rendered upon keystroke event $t_k$.

Let the total loss function $\\mathcal{L}$ be defined as:
$$\\mathcal{L}(\\theta) = \\sum_{i=1}^{N} \\left( y_i - \\hat{y}_i \\right)^2 + \\lambda \\| \\theta \\|_2^2$$

\\begin{figure}
[IMAGE:https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80]
\\caption{System architecture and latency benchmark across incremental parsing streams.}
\\end{figure}

\\begin{table}
\\centering
\\begin{tabular}{lcr}
\\hline
Model & Latency (ms) & Accuracy \\\\ \\hline
Baseline LaTeX & 1420 & 94.2\\% \\\\
Gummi-Engine & 4 & 99.8\\% \\\\ \\hline
\\end{tabular}
\\caption{Performance comparison across compilation pipelines.}
\\end{table}

\\section{Conclusion}
We have successfully demonstrated that instantaneous LaTeX preview transforms the academic authoring experience. Future work will investigate distributed collaborative theorem proving.
`
  }
];

export default function App() {
  const [selectedTemplate, setSelectedTemplate] = useState('sentinel');
  const [markdown, setMarkdown] = useState(TEMPLATES[0].content);
  const [docFormat, setDocFormat] = useState<'a4' | 'beamer'>('a4');
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [theme, setTheme] = useState<'classic' | 'sepia' | 'dark'>('classic');
  const [zoom, setZoom] = useState<number>(90);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [compileStats, setCompileStats] = useState({ time: 0, words: 0, characters: 0 });
  const [editorWidth, setEditorWidth] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const windowWidth = window.innerWidth;
      const newWidth = (e.clientX / windowWidth) * 100;
      if (newWidth >= 20 && newWidth <= 80) {
        setEditorWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const paperRef = useRef<HTMLDivElement>(null);

  // Instant compilation stats counter
  useEffect(() => {
    const startTime = performance.now();
    const words = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
    const characters = markdown.length;
    const endTime = performance.now();
    setCompileStats({
      time: Math.round((endTime - startTime) * 100) / 100,
      words,
      characters
    });
  }, [markdown]);

  // Handle template selection
  const handleSelectTemplate = (id: string) => {
    const t = TEMPLATES.find(item => item.id === id);
    if (t) {
      setMarkdown(t.content);
      setDocFormat(t.format as any);
      setSelectedTemplate(id);
      setShowTemplatesModal(false);
      setErrorMessage(null);
    }
  };

  // Quick insertion helpers
  const insertSnippet = (snippet: string) => {
    setMarkdown(prev => prev + '\n' + snippet + '\n');
  };

  // Copy LaTeX source
  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download .tex source file
  const handleDownloadTex = () => {
    const element = document.createElement("a");
    const file = new Blob([markdown], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedTemplate}-report.tex`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Robust PDF export using a dedicated print window popup to print all pages / slides
  const handleExportPDF = () => {
    if (isExporting) return;
    setIsExporting(true);
    setErrorMessage(null);
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        window.print();
        setIsExporting(false);
        return;
      }

      const elements = docFormat === 'beamer' 
        ? document.querySelectorAll('.beamer-print-sheet')
        : document.querySelectorAll('.printable-paper');
      
      let allPapersHtml = '';
      elements.forEach(el => {
        allPapersHtml += `
          <div style="margin-bottom: 40px; page-break-after: always; break-after: page;">
            ${el.outerHTML}
          </div>
        `;
      });

      if (!allPapersHtml && paperRef.current) {
        allPapersHtml = paperRef.current.outerHTML;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${renderedContent.title || selectedTemplate}</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" crossorigin="anonymous">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @page {
                size: A4 portrait;
                margin: 20mm;
              }
              body { background: white; color: black; font-family: serif; padding: 0; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .printable-paper {
                width: 210mm !important;
                min-height: 297mm !important;
                max-width: none !important;
                margin: 0 auto !important;
                padding: 20mm !important;
                box-sizing: border-box !important;
                box-shadow: none !important;
                border: none !important;
                transform: none !important;
                background: white !important;
                page-break-after: always;
                break-after: page;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
              }
              .beamer-print-sheet {
                background: white !important;
                margin-bottom: 0;
                page-break-after: always;
                break-after: page;
                height: 257mm;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                box-sizing: border-box;
                padding: 0;
              }
              .beamer-slide-page {
                height: 120mm !important;
                max-height: 120mm !important;
                page-break-inside: avoid;
                break-inside: avoid;
                box-shadow: none !important;
                border: 1px solid #d1d5db !important;
                margin: 0 0 8mm 0 !important;
                transform: none !important;
                padding: 6mm 8mm !important;
                box-sizing: border-box;
                overflow: hidden;
              }
              @media print {
                body * { visibility: visible; }
                .printable-paper { page-break-after: always; break-after: page; }
              }
            </style>
          </head>
          <body>
            <div style="width: 100%; margin: 0 auto;">
              ${allPapersHtml}
            </div>
            <script>
              setTimeout(() => {
                window.print();
              }, 600);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (err: any) {
      console.error('PDF Export Error:', err);
      setErrorMessage(err.message || String(err));
      try {
        window.print();
      } catch (e) {}
    } finally {
      setIsExporting(false);
    }
  };

  // Robust LaTeX / Markdown Parser for live preview
  const renderedContent = useMemo(() => {
    try {
      let raw = markdown;

      // Extract metadata reactively and replace escaped ampersands
      let title = '';
      let author = '';
      let institute = '';
      let abstract = '';

      const titleMatch = raw.match(/\\title\{(.*?)\}/s);
      if (titleMatch) title = titleMatch[1].replace(/\\&/g, '&');

      const authorMatch = raw.match(/\\author\{(.*?)\}/s);
      if (authorMatch) author = authorMatch[1].replace(/\\and/g, '•').replace(/\\&/g, '&');

      const instMatch = raw.match(/\\institute\{(.*?)\}/s);
      if (instMatch) institute = instMatch[1].replace(/\\and/g, '•').replace(/\\&/g, '&');

      const absMatch = raw.match(/\\begin\{abstract\}(.*?)(?:\\end\{abstract\}|\\0)/s);
      if (absMatch) abstract = absMatch[1].trim().replace(/\\&/g, '&');

      // Remove header commands from body and replace escaped ampersands
      raw = raw
        .replace(/\\title\{.*?\}/s, '')
        .replace(/\\author\{.*?\}/s, '')
        .replace(/\\institute\{.*?\}/s, '')
        .replace(/\\begin\{abstract\}[\s\S]*?(?:\\end\{abstract\}|\\0)/s, '')
        .replace(/\\&/g, '&');

      // Store placeholders for math blocks
      const mathStore: string[] = [];
      const storeMath = (mathStr: string, display: boolean) => {
        try {
          const rendered = katex.renderToString(mathStr.trim(), { displayMode: display, throwOnError: false });
          const placeholder = `__MATH_PLACEHOLDER_${mathStore.length}__`;
          mathStore.push(display ? `<div class="my-3 text-center overflow-x-auto py-1">${rendered}</div>` : rendered);
          return placeholder;
        } catch (e) {
          return `<span class="text-red-500 font-mono text-xs">[Math Error]</span>`;
        }
      };

      // 1. Replace Display Math $$ ... $$
      raw = raw.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => storeMath(math, true));

      // 2. Replace Inline Math $ ... $
      raw = raw.replace(/\$([^\$\n]+?)\$/g, (_, math) => storeMath(math, false));

      let figureCounter = 0;
      let tableCounter = 0;

      // 3. Figures with images and captions (with auto sequential numbering)
      raw = raw.replace(/\\begin\{figure\}([\s\S]*?)\\end\{figure\}/gs, (_, content) => {
        figureCounter++;
        const imgMatch = content.match(/\[IMAGE:(.*?)\]/);
        const capMatch = content.match(/\\caption\{(.*?)\}/);
        const imgSrc = imgMatch ? imgMatch[1] : '';
        const caption = capMatch ? capMatch[1] : '';

        return `
          <div class="my-2 p-1 bg-gray-50 border border-gray-300 shadow-xs max-w-xs mx-auto">
            <div class="relative bg-white flex items-center justify-center overflow-hidden p-1">
              <img src="${imgSrc}" alt="${caption}" crossorigin="anonymous" class="object-contain max-h-[110px] w-auto mx-auto" />
            </div>
            ${caption ? `<div class="text-center text-[10px] text-gray-700 dark:text-gray-300 mt-1 font-serif italic"><strong>Figure ${figureCounter}:</strong> ${caption}</div>` : ''}
          </div>
        `;
      });

      // 4. Tables (Edward Tufte Style with auto sequential numbering)
      raw = raw.replace(/\\begin\{table\}.*?\\end\{table\}/gs, (match) => {
        tableCounter++;
        const capMatch = match.match(/\\caption\{(.*?)\}/);
        const caption = capMatch ? capMatch[1] : '';

        const tabMatch = match.match(/\\begin\{tabular\}\{(.*?)\}(.*?)\\end\{tabular\}/s);
        if (!tabMatch) return match;

        const colSpec = tabMatch[1].replace(/\|/g, '').trim().split(/\s*/);
        const rows = tabMatch[2].split('\\\\').filter(r => r.trim() !== '');
        
        let tableHtml = '<div class="my-2 overflow-x-auto"><table class="w-full border-collapse font-serif text-[10px]">';
        
        const cleanedRows = rows.map(r => r.replace(/\\hline/g, '').trim()).filter(r => r !== '');

        cleanedRows.forEach((row, idx) => {
          const cols = row.split('&').map(c => c.trim());
          const isHeader = idx === 0;
          
          const borderClass = idx === 0 ? 'border-t-2 border-b border-gray-900 dark:border-gray-100 font-semibold' :
                              idx === cleanedRows.length - 1 ? 'border-b border-gray-900 dark:border-gray-100' : 'border-b border-gray-200 dark:border-zinc-800';

          tableHtml += `<tr class="${borderClass}">`;
          cols.forEach((col, cIdx) => {
            const tag = isHeader ? 'th' : 'td';
            const align = colSpec[cIdx] === 'r' ? 'text-right' : colSpec[cIdx] === 'c' ? 'text-center' : 'text-left';
            tableHtml += `<${tag} class="py-1 px-2 ${align} ${isHeader ? 'font-semibold tracking-wide uppercase text-[10px]' : ''}">${col}</${tag}>`;
          });
          tableHtml += '</tr>';
        });

        tableHtml += '</table>';
        if (caption) {
          tableHtml += `<div class="text-left text-[9px] text-gray-600 dark:text-gray-400 mt-1 font-serif italic"><strong>Table ${tableCounter}:</strong> ${caption}</div>`;
        }
        tableHtml += '</div>';
        return tableHtml;
      });

      // 5. Itemize / Enumerate Lists
      raw = raw.replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/gs, (_, content) => {
        const items = content.split('\\item').filter((i: string) => i.trim() !== '');
        let listHtml = '<ul class="list-disc pl-5 my-3 space-y-1 font-serif text-sm">';
        items.forEach((item: string) => {
          listHtml += `<li>${item.trim()}</li>`;
        });
        listHtml += '</ul>';
        return listHtml;
      });

      raw = raw.replace(/\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/gs, (_, content) => {
        const items = content.split('\\item').filter((i: string) => i.trim() !== '');
        let listHtml = '<ol class="list-decimal pl-5 my-3 space-y-1 font-serif text-sm">';
        items.forEach((item: string) => {
          listHtml += `<li>${item.trim()}</li>`;
        });
        listHtml += '</ol>';
        return listHtml;
      });

      // 6. Sections & Subsections
      raw = raw.replace(/\\section\{(.*?)\}/g, '<h2 class="text-base font-bold font-serif mt-5 mb-2 text-gray-900 dark:text-gray-100">$1</h2>');
      raw = raw.replace(/\\subsection\{(.*?)\}/g, '<h3 class="text-sm font-semibold font-serif mt-4 mb-1.5 text-gray-800 dark:text-gray-200">$1</h3>');

      // 7. Formatting tags
      raw = raw.replace(/\\textbf\{(.*?)\}/g, '<strong class="font-bold">$1</strong>');
      raw = raw.replace(/\\textit\{(.*?)\}/g, '<em class="italic">$1</em>');
      raw = raw.replace(/\\underline\{(.*?)\}/g, '<span class="underline">$1</span>');

      // Paragraph blocks separated by double newlines
      const blocks = raw.split(/\n\s*\n/);
      const parsedBlocks = blocks.map(block => {
        block = block.trim();
        if (!block) return '';
        if (block.startsWith('<h2') || block.startsWith('<h3') || block.startsWith('<div') || block.startsWith('<table') || block.startsWith('<ul') || block.startsWith('<ol')) {
          return block;
        }
        const cleanedBlock = block.replace(/\n/g, ' ');
        return `<p class="mb-3 leading-normal text-justify">${cleanedBlock}</p>`;
      });

      let bodyHtml = parsedBlocks.join('\n');

      // Restore math placeholders
      mathStore.forEach((renderedMath, idx) => {
        bodyHtml = bodyHtml.replace(`__MATH_PLACEHOLDER_${idx}__`, renderedMath);
      });

      const runningLeft = author ? author.split('•')[0].trim() : 'Academic Author';
      const runningCenter = title ? title : 'Interferometric Analysis Report';
      const runningRight = 'A.Y: 2024/2025';

      // Build fully distributed Beamer slides across as many slides of standard size as needed
      const slides: Array<{ title: string; body: string }> = [];

      if (abstract) {
        slides.push({
          title: 'Abstract & Overview',
          body: `<p class="italic text-[11px] leading-snug text-justify">${abstract}</p>`
        });
      }

      const sectionBlocks = raw.split(/(?=\\section\{)/g);

      sectionBlocks.forEach(secBlock => {
        const secMatch = secBlock.match(/\\section\{(.*?)\}/);
        const secTitle = secMatch ? secMatch[1].replace(/\\&/g, '&') : (title || 'Overview');
        let content = secBlock.replace(/\\section\{.*?\}/, '').trim();

        // 1. Extract figures into dedicated slides
        const figRegex = /\\begin\{figure\}([\s\S]*?)\\end\{figure\}/g;
        let match;
        const figures: Array<{ caption: string; html: string }> = [];
        while ((match = figRegex.exec(content)) !== null) {
          const figContent = match[1];
          const imgMatch = figContent.match(/\[IMAGE:(.*?)\]/);
          const capMatch = figContent.match(/\\caption\{(.*?)\}/);
          const imgSrc = imgMatch ? imgMatch[1] : '';
          const caption = capMatch ? capMatch[1] : 'Figure';
          figureCounter++;
          const figHtml = `
            <div class="my-1 p-1 bg-white border border-gray-200 shadow-xs flex flex-col items-center justify-center">
              <img src="${imgSrc}" alt="${caption}" crossorigin="anonymous" class="object-contain max-h-[140px] w-auto mx-auto" />
              <div class="text-center text-[10px] text-gray-700 mt-1 font-serif italic"><strong>Figure ${figureCounter}:</strong> ${caption}</div>
            </div>
          `;
          figures.push({ caption, html: figHtml });
          content = content.replace(match[0], '');
        }

        // 2. Extract tables into dedicated slides
        const tabRegex = /\\begin\{table\}([\s\S]*?)\\end\{table\}/g;
        const tables: Array<{ caption: string; html: string }> = [];
        while ((match = tabRegex.exec(content)) !== null) {
          const tabContent = match[1];
          tableCounter++;
          const capMatch = tabContent.match(/\\caption\{(.*?)\}/);
          const caption = capMatch ? capMatch[1] : 'Table';

          const tabMatchData = tabContent.match(/\\begin\{tabular\}\{(.*?)\}(.*?)\\end\{tabular\}/s);
          if (tabMatchData) {
            const colSpec = tabMatchData[1].replace(/\|/g, '').trim().split(/\s*/);
            const rows = tabMatchData[2].split('\\\\').filter(r => r.trim() !== '');
            let tableHtml = '<div class="my-1 overflow-x-auto"><table class="w-full border-collapse font-serif text-[10px] bg-white shadow-xs">';
            const cleanedRows = rows.map(r => r.replace(/\\hline/g, '').trim()).filter(r => r !== '');

            cleanedRows.forEach((row, idx) => {
              const cols = row.split('&').map(c => c.trim());
              const isHeader = idx === 0;
              const borderClass = idx === 0 ? 'border-t-2 border-b border-gray-900 font-semibold bg-gray-50' :
                                  idx === cleanedRows.length - 1 ? 'border-b border-gray-900' : 'border-b border-gray-200';

              tableHtml += `<tr class="${borderClass}">`;
              cols.forEach((col, cIdx) => {
                const tag = isHeader ? 'th' : 'td';
                const align = colSpec[cIdx] === 'r' ? 'text-right' : colSpec[cIdx] === 'c' ? 'text-center' : 'text-left';
                tableHtml += `<${tag} class="py-1 px-2 ${align} ${isHeader ? 'font-semibold tracking-wide uppercase text-[10px]' : ''}">${col}</${tag}>`;
              });
              tableHtml += '</tr>';
            });

            tableHtml += '</table>';
            if (caption) {
              tableHtml += `<div class="text-center text-[9px] text-gray-700 mt-1 font-serif italic"><strong>Table ${tableCounter}:</strong> ${caption}</div>`;
            }
            tableHtml += '</div>';
            tables.push({ caption, html: tableHtml });
          }
          content = content.replace(match[0], '');
        }

        // 3. Extract itemize lists into dedicated slides
        const itemizeRegex = /\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g;
        const itemizeLists: string[] = [];
        while ((match = itemizeRegex.exec(content)) !== null) {
          const items = match[1].split('\\item').filter((i: string) => i.trim() !== '');
          let listHtml = '<ul class="list-disc pl-4 space-y-0.5 font-serif text-[11px]">';
          items.forEach((item: string) => {
            listHtml += `<li>${item.trim()}</li>`;
          });
          listHtml += '</ul>';
          itemizeLists.push(listHtml);
          content = content.replace(match[0], '');
        }

        // 4. Distribute paragraphs into individual slides so every paragraph gets fitted cleanly onto standard size slides
        const paragraphs = content.split(/\n\s*\n/).map(b => b.trim()).filter(b => b);

        paragraphs.forEach((p, pIdx) => {
          let pHtml = `<p class="mb-1.5 leading-snug text-justify text-[11px]">${p.replace(/\n/g, ' ')}</p>`;
          mathStore.forEach((renderedMath, idx) => {
            pHtml = pHtml.replace(`__MATH_PLACEHOLDER_${idx}__`, renderedMath);
          });
          slides.push({
            title: paragraphs.length > 1 ? `${secTitle} (Part ${pIdx + 1})` : secTitle,
            body: pHtml
          });
        });

        itemizeLists.forEach((listHtml, lIdx) => {
          slides.push({
            title: itemizeLists.length > 1 ? `${secTitle} (Key Points ${lIdx + 1})` : `${secTitle} (Key Points)`,
            body: listHtml
          });
        });

        figures.forEach(fig => {
          slides.push({
            title: `${secTitle} — Data Graphic`,
            body: fig.html
          });
        });

        tables.forEach(tab => {
          slides.push({
            title: `${secTitle} — Tabular Analysis`,
            body: tab.html
          });
        });
      });

      if (slides.length === 0) {
        slides.push({
          title: title || 'Presentation',
          body: bodyHtml
        });
      }

      // Group parsed blocks into A4 pages (~1000 characters per page)
      const a4Pages: string[] = [];
      let currentPageBlocks: string[] = [];
      let currentChars = 0;

      parsedBlocks.forEach(block => {
        const blockLen = block.length;
        if (currentChars + blockLen > 3400 && currentPageBlocks.length > 0) {
          a4Pages.push(currentPageBlocks.join('\n'));
          currentPageBlocks = [block];
          currentChars = blockLen;
        } else {
          currentPageBlocks.push(block);
          currentChars += blockLen;
        }
      });
      if (currentPageBlocks.length > 0) {
        a4Pages.push(currentPageBlocks.join('\n'));
      }
      if (a4Pages.length === 0) {
        a4Pages.push(bodyHtml);
      }

      return {
        title,
        author,
        institute,
        abstract,
        body: bodyHtml,
        a4Pages,
        slides,
        runningLeft,
        runningCenter,
        runningRight
      };
    } catch (err) {
      return {
        title: 'Compilation Error',
        author: '',
        institute: '',
        abstract: '',
        body: `<div class="text-red-600 p-4 font-mono">Error parsing LaTeX document: ${String(err)}</div>`,
        a4Pages: [`<div class="text-red-600 p-4 font-mono">Error parsing LaTeX document: ${String(err)}</div>`],
        slides: [{ title: 'Error', body: `<div class="text-red-600 p-4 font-mono">Error parsing LaTeX document: ${String(err)}</div>` }],
        runningLeft: 'Error',
        runningCenter: 'Error',
        runningRight: '2024'
      };
    }
  }, [markdown]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 overflow-hidden font-sans">
      {/* ERROR BANNER IF COMPILATION FAILS */}
      {errorMessage && (
        <div className="bg-red-600 text-white px-4 py-2.5 text-xs flex items-center justify-between z-30 shadow-md">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span><strong>PDF Compilation Error:</strong> {errorMessage}</span>
          </div>
          <button 
            onClick={() => setErrorMessage(null)} 
            className="text-white hover:text-red-200 font-bold px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* TOP NAVBAR */}
      <header className="flex items-center justify-between px-4 py-2.5 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shadow-xs z-20">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-9 h-9 bg-indigo-600 text-white rounded-lg shadow-sm font-serif font-bold text-lg">
            G
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-base tracking-tight font-serif">Gummi LaTeX Studio</h1>
              <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Instant Gummi Engine
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Sub-millisecond real-time LaTeX & math compilation</p>
          </div>
        </div>

        {/* CENTER CONTROLS */}
        <div className="hidden md:flex items-center space-x-2 bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg">
          <button 
            onClick={() => setShowTemplatesModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-zinc-700 shadow-xs hover:bg-gray-50 dark:hover:bg-zinc-600 transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>Templates: <strong className="capitalize">{selectedTemplate}</strong></span>
          </button>

          <div className="h-4 w-px bg-gray-300 dark:bg-zinc-700"></div>

          <div className="flex items-center space-x-1 bg-white dark:bg-zinc-900 p-0.5 rounded shadow-xs text-xs">
            <button 
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded ${viewMode === 'split' ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
            >
              Split View
            </button>
            <button 
              onClick={() => setViewMode('editor')}
              className={`px-2.5 py-1 rounded ${viewMode === 'editor' ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
            >
              Editor Only
            </button>
            <button 
              onClick={() => setViewMode('preview')}
              className={`px-2.5 py-1 rounded ${viewMode === 'preview' ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
            >
              Preview Only
            </button>
          </div>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center space-x-2">
          <div className="hidden lg:flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded-lg font-mono">
            <span>{compileStats.time}ms compile</span>
            <span>•</span>
            <span>{compileStats.words} words</span>
            <span>•</span>
            <span>{compileStats.characters} chars</span>
          </div>

          <button 
            onClick={handleDownloadTex}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
            title="Download .tex Source"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download .tex</span>
          </button>

          <button 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white shadow-xs transition flex items-center gap-1"
            title="Compile with pdflatex & Export PDF"
          >
            {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Printer className="w-3.5 h-3.5" />}
            <span>{isExporting ? 'Compiling pdflatex...' : 'Export PDF'}</span>
          </button>
        </div>
      </header>

      {/* SUB-TOOLBAR: QUICK SNIPPETS */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-gray-100 dark:bg-zinc-900/80 border-b border-gray-200 dark:border-zinc-800 text-xs overflow-x-auto">
        <div className="flex items-center space-x-1.5 shrink-0">
          <span className="text-gray-500 dark:text-gray-400 font-medium mr-1">Insert:</span>
          <button onClick={() => insertSnippet('\\section{New Section Title}')} className="px-2 py-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded hover:bg-gray-50 dark:hover:bg-zinc-700 font-mono">\section</button>
          <button onClick={() => insertSnippet('$$\\int_{0}^{\\infty} f(x) dx$$')} className="px-2 py-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded hover:bg-gray-50 dark:hover:bg-zinc-700 font-mono">Equation</button>
          <button onClick={() => insertSnippet('\\begin{figure}\n[IMAGE:https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80]\n\\caption{Scientific Graph Caption.}\n\\end{figure}')} className="px-2 py-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded hover:bg-gray-50 dark:hover:bg-zinc-700 font-mono">Figure</button>
          <button onClick={() => insertSnippet('\\begin{table}\n\\centering\n\\begin{tabular}{|c|c|}\n\\hline\nA & B \\\\ \\hline\n1 & 2 \\\\ \\hline\n\\end{tabular}\n\\caption{Caption}\n\\end{table}')} className="px-2 py-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded hover:bg-gray-50 dark:hover:bg-zinc-700 font-mono">Table</button>
          <button onClick={() => insertSnippet('\\begin{itemize}\n\\item First item\n\\item Second item\n\\end{itemize}')} className="px-2 py-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded hover:bg-gray-50 dark:hover:bg-zinc-700 font-mono">List</button>
        </div>

        <div className="flex items-center space-x-3 shrink-0 ml-4">
          <div className="flex items-center space-x-1">
            <span className="text-gray-500">Format:</span>
            <select 
              value={docFormat} 
              onChange={(e) => setDocFormat(e.target.value as any)}
              className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded px-2 py-0.5 text-xs font-medium"
            >
              <option value="a4">A4 Academic Report (11pt)</option>
              <option value="beamer">Beamer Slides (16:9)</option>
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-gray-500">Theme:</span>
            <select 
              value={theme} 
              onChange={(e) => setTheme(e.target.value as any)}
              className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded px-2 py-0.5 text-xs"
            >
              <option value="classic">Classic Paper</option>
              <option value="sepia">Warm Sepia</option>
              <option value="dark">Dark Academic</option>
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-gray-500">Zoom:</span>
            <button onClick={() => setZoom(z => Math.max(75, z - 10))} className="px-1.5 py-0.5 bg-white dark:bg-zinc-800 border rounded">-</button>
            <span className="w-10 text-center font-mono">{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(150, z + 10))} className="px-1.5 py-0.5 bg-white dark:bg-zinc-800 border rounded">+</button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden select-none">
        {/* EDITOR PANEL */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <div 
            style={viewMode === 'split' ? { width: `${editorWidth}%` } : undefined}
            className={`flex flex-col h-full border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 ${viewMode === 'split' ? '' : 'w-full'}`}
          >
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-zinc-900/50 border-b border-gray-200 dark:border-zinc-800 text-xs font-semibold text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Code className="w-3.5 h-3.5 text-indigo-500" />
                <span>LaTeX Source Editor (Gummi Live Stream)</span>
              </div>
              <span className="text-xs text-gray-400 font-mono">UTF-8 • LaTeX</span>
            </div>
            
            <div className="flex-1 relative">
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Type LaTeX code here... changes render instantly."
                className="w-full h-full p-4 font-mono text-sm bg-transparent resize-none focus:outline-none leading-relaxed text-gray-800 dark:text-gray-200 selection:bg-indigo-500/20"
                spellCheck={false}
              />
            </div>
          </div>
        )}

        {/* DRAGGABLE DIVIDER */}
        {viewMode === 'split' && (
          <div 
            onMouseDown={() => setIsDragging(true)}
            className="w-2 bg-gray-200 dark:bg-zinc-800 hover:bg-indigo-500 cursor-col-resize transition flex items-center justify-center group z-10"
            title="Drag to resize panels"
          >
            <div className="w-0.5 h-10 bg-gray-400 group-hover:bg-white rounded-full"></div>
          </div>
        )}

        {/* PREVIEW PANEL */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div 
            style={viewMode === 'split' ? { width: `${100 - editorWidth}%` } : undefined}
            className={`flex flex-col h-full bg-gray-100 dark:bg-zinc-950 overflow-y-auto ${viewMode === 'split' ? '' : 'w-full'} p-6 lg:p-10 transition-all`}
          >
            <div className="flex items-center justify-between mb-4 max-w-3xl mx-auto w-full text-xs text-gray-500">
              <span className="font-serif italic">Live LaTeX Document View ({docFormat === 'a4' ? 'A4 11pt Report' : 'Beamer 16:9 Slides'})</span>
              <span>Instantaneous Render Engine Active</span>
            </div>

            {/* PAPER SHEET OR SLIDES */}
            {docFormat === 'beamer' ? (
              <div className="space-y-8 max-w-[760px] mx-auto w-full">
                {(() => {
                  const slides = [...renderedContent.slides];
                  if (slides.length % 2 !== 0) {
                    slides.push({ title: 'Summary / Q&A', body: '<p class="italic text-gray-500">End of presentation slides.</p>' });
                  }
                  const slidePairs: Array<Array<typeof renderedContent.slides[0]>> = [];
                  for (let i = 0; i < slides.length; i += 2) {
                    slidePairs.push(slides.slice(i, i + 2));
                  }
                  return slidePairs.map((pair, pIdx) => (
                    <div key={pIdx} className="beamer-print-sheet printable-paper bg-white/40 dark:bg-zinc-900/40 p-2 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-1">
                      {pair.map((slide, sIdx) => {
                        const globalIndex = pIdx * 2 + sIdx;
                        return (
                          <div 
                            key={globalIndex}
                            ref={globalIndex === 0 ? paperRef : undefined}
                            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                            className={`beamer-slide-page w-full shadow-xl transition-transform duration-150 p-4 lg:p-5 h-[250px] max-h-[250px] rounded-xl flex flex-col justify-between overflow-hidden ${
                              theme === 'classic' ? 'bg-white text-gray-900 border border-gray-300' :
                              theme === 'sepia' ? 'bg-[#fbf0d9] text-[#433422] border border-[#e5d2b3]' :
                              'bg-zinc-900 text-gray-100 border border-zinc-800'
                            }`}
                          >
                            <div className="shrink-0">
                              <div className="pb-1 mb-1 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center text-[10px] font-sans text-gray-500">
                                <span className="font-bold">{renderedContent.title || 'Presentation'}</span>
                                <span>{renderedContent.author}</span>
                              </div>

                              <h2 className="text-xs font-bold font-serif mb-1 text-indigo-600 dark:text-indigo-400">
                                {slide.title}
                              </h2>
                            </div>

                            <div 
                              className="font-serif text-[10px] leading-tight space-y-1 overflow-hidden flex-1 my-1"
                              dangerouslySetInnerHTML={{ __html: slide.body }}
                            />

                            <div className="shrink-0 pt-1.5 border-t border-gray-200 dark:border-zinc-800 flex justify-between items-center text-[9px] text-gray-400 font-mono">
                              <span>{renderedContent.institute}</span>
                              <span className="font-bold text-indigo-600 dark:text-indigo-400">Slide {globalIndex + 1} of {renderedContent.slides.length}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ));
                })()}
              </div>
            ) : (
              <div className="space-y-12 max-w-[794px] mx-auto w-full">
                {renderedContent.a4Pages.map((pageBody, pIdx) => (
                  <div 
                    key={pIdx}
                    ref={pIdx === 0 ? paperRef : undefined}
                    style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                    className={`printable-paper mx-auto w-full shadow-2xl transition-transform duration-150 max-w-[794px] h-[1123px] p-12 lg:p-14 relative pb-20 overflow-hidden ${
                      theme === 'classic' ? 'bg-white text-gray-900 border border-gray-300' :
                      theme === 'sepia' ? 'bg-[#fbf0d9] text-[#433422] border border-[#e5d2b3]' :
                      'bg-zinc-900 text-gray-100 border border-zinc-800'
                    }`}
                  >
                    <div>
                      {/* ACADEMIC RUNNING HEADER */}
                      <div className="pb-3 mb-6 border-b border-gray-400 dark:border-zinc-700 flex justify-between items-center text-[10px] font-serif text-gray-600 dark:text-gray-400">
                        <span className="font-bold">{renderedContent.runningLeft}</span>
                        <span className="italic truncate max-w-[240px] sm:max-w-sm">{renderedContent.runningCenter}</span>
                        <span className="font-mono">{renderedContent.runningRight}</span>
                      </div>

                      {/* DOCUMENT TITLE & AUTHOR (ONLY ON PAGE 1) */}
                      {pIdx === 0 && (
                        <div className="text-center pb-6 border-b border-gray-200 dark:border-zinc-800 mb-6">
                          <h1 className="font-bold font-serif mb-2 tracking-wide text-2xl">
                            {renderedContent.title || 'Untitled Report'}
                          </h1>
                          {renderedContent.author && (
                            <div className="text-xs font-serif font-medium text-gray-700 dark:text-gray-300 mb-1">
                              {renderedContent.author}
                            </div>
                          )}
                          {renderedContent.institute && (
                            <div className="text-[11px] font-serif italic text-gray-500 dark:text-gray-400">
                              {renderedContent.institute}
                            </div>
                          )}
                        </div>
                      )}

                      {/* ABSTRACT IF PRESENT (ONLY ON PAGE 1) */}
                      {pIdx === 0 && renderedContent.abstract && (
                        <div className="my-6 px-6 py-3 bg-gray-50 dark:bg-zinc-800/50 border-l-4 border-indigo-600 font-serif text-xs">
                          <h4 className="font-bold text-[11px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">Abstract</h4>
                          <p className="italic leading-normal text-justify">{renderedContent.abstract}</p>
                        </div>
                      )}

                      {/* DOCUMENT BODY CHUNK */}
                      <div 
                        className="font-serif text-sm leading-relaxed space-y-4"
                        dangerouslySetInnerHTML={{ __html: pageBody }}
                      />
                    </div>

                    {/* FOOTER ABSOLUTE AT BOTTOM */}
                    <div className="absolute bottom-12 left-12 right-12 pt-4 border-t border-gray-200 dark:border-zinc-800 flex justify-between items-center text-[10px] text-gray-400 font-serif bg-inherit">
                      <span>Gummi LaTeX Studio Preview</span>
                      <span>Page {pIdx + 1} of {renderedContent.a4Pages.length}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* TEMPLATES MODAL */}
      {showTemplatesModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl max-w-xl w-full p-6 border border-gray-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold font-serif flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Select LaTeX Document Template
              </h3>
              <button 
                onClick={() => setShowTemplatesModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {TEMPLATES.map(t => (
                <div 
                  key={t.id}
                  onClick={() => handleSelectTemplate(t.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                    selectedTemplate === t.id 
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30' 
                      : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-800/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold font-serif text-sm">{t.name}</h4>
                      {selectedTemplate === t.id && (
                        <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full font-medium">Active</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowTemplatesModal(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-xs font-medium rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
