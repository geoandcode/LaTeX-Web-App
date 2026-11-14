/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import katex from 'katex';
import { 
  FileText, Code, Download, Eye, Settings, HelpCircle, 
  Sparkles, Copy, Check, RefreshCw, ZoomIn, ZoomOut, 
  Printer, BookOpen, Layers, Maximize2, Minimize2, 
  Plus, Trash2, Edit3, Save, Share2, Award, Terminal, Image as ImageIcon, Layout, Loader2, AlertCircle
} from 'lucide-react';

// --- TEMPLATES ---
const TEMPLATES = [
  {
    id: 'sentinel',
    name: 'Interferometric Analysis (Sentinel-1)',
    description: 'Academic lab report style with running headers, Sentinel-1 radar stacks, and interferograms.',
    format: 'a4',
    content: `\\title{Interferometric SAR Analysis of Pozzuoli Deformation Field}
\\author{Francesco Gambetta}
\\institute{Politecnico di Milano \\and Department of Aerospace Engineering}

\\begin{abstract}
This report details the differential interferometric synthetic aperture radar (DInSAR) processing chain applied to Sentinel-1 acquisitions over the Pozzuoli caldera (Campi Flegrei). We examine co-registered stacks, perpendicular baseline distributions, and unwrapped phase fringes associated with ongoing bradyseism.
\\end{abstract}

\\section{Coreregistered Stack}
The SLC images acquired along descending track 22 were co-registered using enhanced spectral diversity (ESD) and precise orbit ephemerides. 

\\begin{figure}
[IMAGE:https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80]
\\caption{Coregistered stack (RGB representation of amplitude and backscatter coherence).}
\\end{figure}

The co-registration accuracy achieved sub-pixel precision ($\\sigma < 0.02$ pixels), enabling robust phase tracking across temporal baselines spanning 2024.

\\section{Interferometric Phase \\& Baseline Distribution}
Topographic phase contributions were removed using the Copernicus 30m DEM. The resulting interferograms exhibit high coherence over stable terrain while decorrelating in vegetated caldera sectors.

\\begin{figure}
[IMAGE:https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80]
\\caption{Perpendicular baseline temporal distribution and interferometric fringe rate.}
\\end{figure}

Let the interferometric phase $\\phi$ be expressed as the superposition of several geophysical components:
$$\\phi = \\phi_{\\text{topo}} + \\phi_{\\text{defo}} + \\phi_{\\text{atmos}} + \\phi_{\\text{orbit}} + \\epsilon$$

\\begin{table}
\\centering
\\begin{tabular}{|l|c|r|}
\\hline
Parameter & Value & Unit \\\\ \\hline
Center Frequency & 5.405 & GHz (C-band) \\\\
Polarization & VV & - \\\\
Repeat Cycle & 12 & Days \\\\ \\hline
\\end{tabular}
\\caption{Sentinel-1 acquisition parameters for Pozzuoli dataset.}
\\end{table}

\\section{Conclusion}
The DInSAR time series confirms continuous uplift acceleration in the Rione Terra sector of Pozzuoli.
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
\\begin{tabular}{|l|c|r|}
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

  // Backend pdflatex compilation trigger and direct file download dialog
  const handleExportPDF = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/compile-latex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latexCode: markdown, filename: selectedTemplate })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server compilation failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedTemplate}-report.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('PDF Export Error:', err);
      setErrorMessage(err.message || String(err));
    } finally {
      setIsExporting(false);
    }
  };

  // Robust LaTeX / Markdown Parser for live preview
  const renderedContent = useMemo(() => {
    try {
      let raw = markdown;

      // Extract metadata reactively
      let title = '';
      let author = '';
      let institute = '';
      let abstract = '';

      const titleMatch = raw.match(/\\title\{(.*?)\}/s);
      if (titleMatch) title = titleMatch[1];

      const authorMatch = raw.match(/\\author\{(.*?)\}/s);
      if (authorMatch) author = authorMatch[1].replace(/\\and/g, '•');

      const instMatch = raw.match(/\\institute\{(.*?)\}/s);
      if (instMatch) institute = instMatch[1].replace(/\\and/g, '•');

      const absMatch = raw.match(/\\begin\{abstract\}(.*?)(?:\\end\{abstract\}|\\0)/s);
      if (absMatch) abstract = absMatch[1].trim();

      // Remove header commands from body
      raw = raw
        .replace(/\\title\{.*?\}/s, '')
        .replace(/\\author\{.*?\}/s, '')
        .replace(/\\institute\{.*?\}/s, '')
        .replace(/\\begin\{abstract\}[\s\S]*?(?:\\end\{abstract\}|\\0)/s, '');

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

      // 3. Figures with images and captions
      raw = raw.replace(/\\begin\{figure\}([\s\S]*?)\\end\{figure\}/gs, (_, content) => {
        const imgMatch = content.match(/\[IMAGE:(.*?)\]/);
        const capMatch = content.match(/\\caption\{(.*?)\}/);
        const imgSrc = imgMatch ? imgMatch[1] : '';
        const caption = capMatch ? capMatch[1] : '';

        return `
          <div class="my-4 border border-gray-400 bg-zinc-900 p-1.5 shadow-sm">
            <div class="relative bg-black flex items-center justify-center overflow-hidden min-h-[160px]">
              <img src="${imgSrc}" alt="${caption}" crossorigin="anonymous" class="w-full object-cover max-h-[260px] opacity-95 hover:opacity-100 transition" />
            </div>
            ${caption ? `<div class="text-center text-[11px] text-gray-700 dark:text-gray-300 mt-1.5 font-serif italic">Figure: ${caption}</div>` : ''}
          </div>
        `;
      });

      // 4. Tables
      raw = raw.replace(/\\begin\{table\}.*?\\end\{table\}/gs, (match) => {
        const capMatch = match.match(/\\caption\{(.*?)\}/);
        const caption = capMatch ? capMatch[1] : '';

        const tabMatch = match.match(/\\begin\{tabular\}\{(.*?)\}(.*?)\\end\{tabular\}/s);
        if (!tabMatch) return match;

        const rows = tabMatch[2].split('\\\\').filter(r => r.trim() !== '');
        let tableHtml = '<div class="my-4 overflow-x-auto"><table class="w-full border-collapse border border-gray-400 text-xs font-serif">';
        
        rows.forEach((row, idx) => {
          if (row.includes('\\hline')) return;
          const cols = row.split('&').map(c => c.trim().replace(/\\hline/g, ''));
          const isHeader = idx === 0 || (idx === 1 && rows[0].includes('\\hline'));
          
          tableHtml += '<tr class="border-b border-gray-300">';
          cols.forEach(col => {
            const tag = isHeader ? 'th' : 'td';
            tableHtml += `<${tag} class="border border-gray-300 px-2 py-1.5 ${isHeader ? 'bg-gray-100 dark:bg-zinc-800 font-bold text-center' : 'text-left'}">${col}</${tag}>`;
          });
          tableHtml += '</tr>';
        });

        tableHtml += '</table>';
        if (caption) {
          tableHtml += `<div class="text-center text-[11px] text-gray-600 dark:text-gray-400 mt-1 font-serif italic">Table: ${caption}</div>`;
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

      return {
        title,
        author,
        institute,
        abstract,
        body: bodyHtml,
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
      <div className="flex-1 flex overflow-hidden">
        {/* EDITOR PANEL */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <div className={`flex flex-col h-full border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
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

        {/* PREVIEW PANEL */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className={`flex flex-col h-full bg-gray-100 dark:bg-zinc-950 overflow-y-auto ${viewMode === 'split' ? 'w-1/2' : 'w-full'} p-6 lg:p-10 transition-all`}>
            <div className="flex items-center justify-between mb-4 max-w-3xl mx-auto w-full text-xs text-gray-500">
              <span className="font-serif italic">Live LaTeX Document View ({docFormat === 'a4' ? 'A4 11pt Report' : 'Beamer 16:9 Slides'})</span>
              <span>Instantaneous Render Engine Active</span>
            </div>

            {/* PAPER SHEET */}
            <div 
              ref={paperRef}
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
              className={`printable-paper mx-auto w-full shadow-2xl transition-transform duration-150 ${
                docFormat === 'a4' ? 'max-w-[720px] p-10 lg:p-12 min-h-[960px]' : 'max-w-[880px] p-12 lg:p-16 min-h-[580px] rounded-lg'
              } ${
                theme === 'classic' ? 'bg-white text-gray-900 border border-gray-300' :
                theme === 'sepia' ? 'bg-[#fbf0d9] text-[#433422] border border-[#e5d2b3]' :
                'bg-zinc-900 text-gray-100 border border-zinc-800'
              }`}
            >
              {/* ACADEMIC RUNNING HEADER */}
              <div className="pb-2.5 mb-6 border-b border-gray-400 dark:border-zinc-700 flex justify-between items-center text-[10px] font-serif text-gray-600 dark:text-gray-400">
                <span className="font-bold">{renderedContent.runningLeft}</span>
                <span className="italic truncate max-w-[240px] sm:max-w-sm">{renderedContent.runningCenter}</span>
                <span className="font-mono">{renderedContent.runningRight}</span>
              </div>

              {/* DOCUMENT TITLE & AUTHOR */}
              <div className="text-center pb-5 border-b border-gray-200 dark:border-zinc-800 mb-5">
                <h1 className={`font-bold font-serif mb-2 tracking-wide ${docFormat === 'a4' ? 'text-xl' : 'text-2xl'}`}>
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

              {/* ABSTRACT IF PRESENT */}
              {renderedContent.abstract && (
                <div className="my-5 px-5 py-2.5 bg-gray-50 dark:bg-zinc-800/50 border-l-3 border-indigo-600 font-serif text-xs">
                  <h4 className="font-bold text-[11px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">Abstract</h4>
                  <p className="italic leading-normal text-justify">{renderedContent.abstract}</p>
                </div>
              )}

              {/* DOCUMENT BODY */}
              <div 
                className="font-serif text-sm leading-normal space-y-3.5"
                dangerouslySetInnerHTML={{ __html: renderedContent.body }}
              />

              {/* FOOTER */}
              <div className="mt-14 pt-4 border-t border-gray-200 dark:border-zinc-800 flex justify-between items-center text-[10px] text-gray-400 font-serif">
                <span>Gummi LaTeX Studio Preview</span>
                <span>Page 1 of 1</span>
              </div>
            </div>
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
