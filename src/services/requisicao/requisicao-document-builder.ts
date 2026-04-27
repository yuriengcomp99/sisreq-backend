import {
  AlignmentType,
  BorderStyle,
  Document,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  VerticalAlign,
} from "docx"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import fs from "node:fs"
import path from "node:path"
import type { RequisicaoDocumentRow } from "./requisicao-document-helpers.js"
import { contratoLabel, empenhoTipoLabel, formatDatePtBrLong, formatMoneyBr, groupDetalhesByFornecedor } from "./requisicao-document-helpers.js"

const MODEL_IMAGE_PATH = path.resolve(process.cwd(), "src", "assets", "requisicao-model", "image.png")
const DOCX_FONT = "Times New Roman"

function tr(
  text: string,
  opts: {
    bold?: boolean
    size?: number
    underline?: Record<string, never>
  } = {}
): TextRun {
  return new TextRun({
    text,
    font: DOCX_FONT,
    ...opts,
  })
}

function tipoUGLabel(tipo: string): string {
  const normalized = String(tipo || "").trim().toUpperCase()
  if (normalized === "CARONA") return "Não Participante"
  if (normalized === "GERENCIADORA") return "Gerenciadora"
  if (normalized === "PARTICIPANTE") return "Participante"
  return tipo || "Não Participante"
}

function fonteRecursoNC(r: RequisicaoDocumentRow): string {
  if (!r.notaCredito) return "dados da NC não informados"
  const nc = r.notaCredito
  const prazo = new Date(nc.prazo).toLocaleDateString("pt-BR")
  return [nc.numero, nc.emitente, nc.favorecido, prazo].filter(Boolean).join(" - ")
}

function readModelImage(): Buffer | null {
  try {
    return fs.readFileSync(MODEL_IMAGE_PATH)
  } catch {
    return null
  }
}

function headerParagraphs(): Paragraph[] {
  const imageData = readModelImage()
  const lines = [
    "MINISTÉRIO DA DEFESA",
    "EXÉRCITO BRASILEIRO",
    "COLOG\tBa Ap Log",
    "BATALHÃO CENTRAL DE MANUTENÇÃO E SUPRIMENTO",
    "(Batalhão Marechal Dutra)",
  ]
  const paragraphs = lines.map(
    (t) =>
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [tr(t, { bold: true, size: 24 })],
        spacing: { after: 70 },
      })
  )
  if (imageData) {
    paragraphs.unshift(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [
          new ImageRun({
            data: imageData,
            type: "png",
            transformation: { width: 95, height: 95 },
          }),
        ],
      })
    )
  }
  return paragraphs
}

function cellBorder() {
  return {
    top: { style: BorderStyle.SINGLE, size: 1, color: "333333" },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: "333333" },
    left: { style: BorderStyle.SINGLE, size: 1, color: "333333" },
    right: { style: BorderStyle.SINGLE, size: 1, color: "333333" },
  }
}

function chunk<T>(items: T[], size: number): T[][] {
  if (size <= 0) return [items]
  const out: T[][] = []
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size))
  return out
}

function buildFornecedorTable(
  fornecedor: string,
  detalhes: RequisicaoDocumentRow["detalhes"]
): Table {
  const totalItens = detalhes.reduce((s, d) => s + d.valor_total, 0)

  const fornecedorRow = new TableRow({
    children: [
      new TableCell({
        columnSpan: 7,
        verticalAlign: VerticalAlign.CENTER,
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        borders: cellBorder(),
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [tr(fornecedor, { bold: true, size: 22 })],
          }),
        ],
      }),
    ],
  })

  const headerRow = new TableRow({
    children: ["ITEM", "SUBITEM", "DESCRIÇÃO", "UND", "QTDE", "VALOR UNIT", "VALOR TOTAL"].map(
      (h) =>
        new TableCell({
          verticalAlign: VerticalAlign.CENTER,
          margins: { top: 60, bottom: 60, left: 60, right: 60 },
          borders: cellBorder(),
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [tr(h, { bold: true, size: 21 })],
            }),
          ],
        })
    ),
  })

  const itemRows = detalhes.map(
    (d) =>
      new TableRow({
        children: [
          new TableCell({
            borders: cellBorder(),
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [tr(d.nr_item, { size: 20 })],
              }),
            ],
          }),
          new TableCell({
            borders: cellBorder(),
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [tr(d.subitem, { size: 20 })],
              }),
            ],
          }),
          new TableCell({
            borders: cellBorder(),
            children: [
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [tr(d.descricao, { size: 20 })],
              }),
            ],
          }),
          new TableCell({
            borders: cellBorder(),
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [tr(d.und, { size: 20 })],
              }),
            ],
          }),
          new TableCell({
            borders: cellBorder(),
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [tr(String(d.qtd), { size: 20 })],
              }),
            ],
          }),
          new TableCell({
            borders: cellBorder(),
            children: [
              new Paragraph({
                alignment: AlignmentType.END,
                children: [tr(formatMoneyBr(d.valor_unitario), { size: 20 })],
              }),
            ],
          }),
          new TableCell({
            borders: cellBorder(),
            children: [
              new Paragraph({
                alignment: AlignmentType.END,
                children: [tr(formatMoneyBr(d.valor_total), { size: 20 })],
              }),
            ],
          }),
        ],
      })
  )

  const totalRow = new TableRow({
    children: [
      new TableCell({
        columnSpan: 6,
        borders: cellBorder(),
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [tr("TOTAL DO FORNECEDOR", { bold: true, size: 20 })],
          }),
        ],
      }),
      new TableCell({
        borders: cellBorder(),
        children: [
          new Paragraph({
            alignment: AlignmentType.END,
            children: [tr(formatMoneyBr(totalItens), { size: 20 })],
          }),
        ],
      }),
    ],
  })

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [fornecedorRow, headerRow, ...itemRows, totalRow],
  })
}

export async function buildRequisicaoDocx(
  r: RequisicaoDocumentRow
): Promise<Buffer> {
  const groups = groupDetalhesByFornecedor(r.detalhes, "dados do fornecedor aqui")
  const tablesContent: (Paragraph | Table)[] = []
  for (const g of groups) {
    for (const part of chunk(g.itens, 10)) {
      tablesContent.push(
        new Paragraph({
          pageBreakBefore: true,
          spacing: { before: 120, after: 120 },
          children: [tr("REQUISIÇÃO DE EMPENHO", { bold: true, size: 22 })],
        })
      )
      tablesContent.push(buildFornecedorTable(g.fornecedor, part))
    }
  }

  const despachoHeader = new Paragraph({
    pageBreakBefore: true,
    alignment: AlignmentType.CENTER,
    spacing: { before: 80, after: 200 },
    children: [tr("DESPACHO", { bold: true, underline: {}, size: 26 })],
  })

  const despachoAprovacao = new Paragraph({
    spacing: { after: 120 },
    children: [tr("APROVAÇÃO DO FISCAL ADMINISTRATIVO", { bold: true, underline: {} })],
  })

  const despachoTexto1 = new Paragraph({
    spacing: { after: 240 },
    alignment: AlignmentType.JUSTIFIED,
    children: [tr("Aprovo a aquisição do material solicitado, conforme descrito na requisição.")],
  })

  const assinaturaFiscal = new Paragraph({
    spacing: { after: 40 },
    alignment: AlignmentType.CENTER,
    children: [tr("VÍTOR CESAR VELASCO FAVARO – 1º TEN", { bold: true })],
  })

  const cargoFiscal = new Paragraph({
    spacing: { after: 180 },
    alignment: AlignmentType.CENTER,
    children: [tr("Fiscal Administrativo")],
  })

  const despachoODTitulo = new Paragraph({
    spacing: { after: 120 },
    children: [tr("DESPACHO DO ORDENADOR DE DESPESAS", { bold: true, underline: {} })],
  })

  const despachoOD1 = new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    children: [tr("Autorizo a aquisição do material solicitado, conforme descrito.")],
  })

  const despachoOD2 = new Paragraph({
    spacing: { after: 220 },
    alignment: AlignmentType.JUSTIFIED,
    children: [
      tr("Seja enviada a requisição à SALC desta UG para adoção das providências cabíveis."),
    ],
  })

  const assinaturaOD = new Paragraph({
    spacing: { after: 40 },
    alignment: AlignmentType.CENTER,
    children: [tr("JONATHAS DA COSTA JARDIM – TEN CEL", { bold: true })],
  })

  const cargoOD = new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [tr("OD do BCMS")],
  })

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          ...headerParagraphs(),
          new Paragraph({
            spacing: { before: 160, after: 80 },
            children: [
              tr(`DIEx Requisitório nº ${r.numero_diex} – ${r.de}/BCMS`, { size: 24 }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [tr(`NUP: ${r.nup}`, { size: 24 })],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { after: 140 },
            children: [tr(`Rio de Janeiro-RJ, ${formatDatePtBrLong(r.data_req)}`, { size: 24 })],
          }),
          new Paragraph({
            spacing: { after: 80 },
            children: [tr("Do ", { bold: true, size: 24 }), tr(r.de, { size: 24 })],
          }),
          new Paragraph({
            spacing: { after: 60 },
            children: [tr("Ao ", { bold: true, size: 24 }), tr(r.para, { size: 24 })],
          }),
          new Paragraph({
            spacing: { after: 140 },
            children: [tr("Assunto: ", { bold: true, size: 24 }), tr(r.assunto, { size: 24 })],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 120 },
            children: [
              tr("1. Nos termos do contido no Art. 13 das IG 12-02, solicito autorização para aquisição de material de Expediente em geral, como UG ", { size: 24 }),
              tr(`"${tipoUGLabel(r.tipo)}"`, { bold: true, size: 24 }),
              tr(`, do Pregão Eletrônico Nr ${r.nr_pregao} — BATALHÃO CENTRAL DE MANUTENÇÃO E SUPRIMENTO — UASG (${r.ug}). devido a necessidade de manutenção das viaturas operacionais deste batalhão de manutenção de viaturas militares.`, { size: 24 }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 120 },
            children: [tr(`2. Fonte de recurso: ${fonteRecursoNC(r)}`, { size: 24 })],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [tr(`3. Tipo de empenho: ${empenhoTipoLabel(r.empenho_tipo)}`, { size: 24 })],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [tr(`4. Contrato: ${contratoLabel(r.contrato)}`, { size: 24 })],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [tr(`5. Classe/Grupo PCA: ${r.classe_grupo_pca}`, { size: 24 })],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [tr(`6. Nr contratação PCA: ${r.nr_contratacao_pca}`, { size: 24 })],
          }),
          ...tablesContent,
          despachoHeader,
          despachoAprovacao,
          despachoTexto1,
          assinaturaFiscal,
          cargoFiscal,
          despachoODTitulo,
          despachoOD1,
          despachoOD2,
          assinaturaOD,
          cargoOD,
        ],
      },
    ],
  })

  return Buffer.from(await Packer.toBuffer(doc))
}

/** PDF compacto com os mesmos dados (layout simplificado; refinável). */
export async function buildRequisicaoPdf(
  r: RequisicaoDocumentRow
): Promise<Buffer> {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.TimesRoman)
  const fontBold = await pdf.embedFont(StandardFonts.TimesRomanBold)

  const pageW = 595.28
  const pageH = 841.89
  const margin = 48
  let page = pdf.addPage([pageW, pageH])
  let y = pageH - margin
  const lineH = 12
  const maxW = pageW - 2 * margin
  const imageData = readModelImage()

  function ensureSpace(lines = 1) {
    if (y < margin + lines * lineH) {
      page = pdf.addPage([pageW, pageH])
      y = pageH - margin
    }
  }

  function wrapLine(text: string, size: number, bold = false): string[] {
    const f = bold ? fontBold : font
    const words = text.split(/\s+/)
    const lines: string[] = []
    let cur = ""
    for (const w of words) {
      const tryLine = cur ? `${cur} ${w}` : w
      if (f.widthOfTextAtSize(tryLine, size) <= maxW) {
        cur = tryLine
      } else {
        if (cur) lines.push(cur)
        cur = w
      }
    }
    if (cur) lines.push(cur)
    return lines.length ? lines : [""]
  }

  function wrapWithinWidth(
    text: string,
    width: number,
    size: number,
    bold = false
  ): string[] {
    const f = bold ? fontBold : font
    const words = String(text || "").split(/\s+/).filter(Boolean)
    if (!words.length) return [""]
    const out: string[] = []
    let cur = ""
    for (const w of words) {
      const trial = cur ? `${cur} ${w}` : w
      if (f.widthOfTextAtSize(trial, size) <= width) {
        cur = trial
      } else {
        if (cur) out.push(cur)
        cur = w
      }
    }
    if (cur) out.push(cur)
    return out
  }

  function drawJustifiedParagraph(text: string, size = 11) {
    const lines = wrapWithinWidth(text, maxW, size, false)
    for (let i = 0; i < lines.length; i++) {
      ensureSpace()
      const ln = lines[i]
      const isLast = i === lines.length - 1
      if (isLast || !ln.includes(" ")) {
        page.drawText(ln, { x: margin, y, size, font })
      } else {
        const words = ln.split(" ")
        const wordsWidth = words.reduce((acc, w) => acc + font.widthOfTextAtSize(w, size), 0)
        const slots = words.length - 1
        const spacing = (maxW - wordsWidth) / slots
        let xx = margin
        for (const [idx, w] of words.entries()) {
          page.drawText(w, { x: xx, y, size, font })
          xx += font.widthOfTextAtSize(w, size)
          if (idx < slots) xx += spacing
        }
      }
      y -= lineH
    }
  }

  function draw(text: string, size = 10, bold = false) {
    for (const ln of wrapLine(text, size, bold)) {
      ensureSpace()
      page.drawText(ln, {
        x: margin,
        y,
        size,
        font: bold ? fontBold : font,
        color: rgb(0, 0, 0),
      })
      y -= lineH
    }
  }

  function drawCenter(text: string, size = 11, bold = true) {
    for (const ln of wrapLine(text, size, bold)) {
      ensureSpace()
      const w = (bold ? fontBold : font).widthOfTextAtSize(ln, size)
      page.drawText(ln, {
        x: (pageW - w) / 2,
        y,
        size,
        font: bold ? fontBold : font,
      })
      y -= lineH + 2
    }
  }

  if (imageData) {
    try {
      const logo = await pdf.embedPng(imageData)
      const targetW = 64
      const ratio = logo.height / logo.width
      const targetH = targetW * ratio
      page.drawImage(logo, {
        x: (pageW - targetW) / 2,
        y: y - targetH,
        width: targetW,
        height: targetH,
      })
      y -= targetH + 10
    } catch {
      // imagem inválida: segue sem logo
    }
  }

  drawCenter("MINISTÉRIO DA DEFESA", 11, true)
  drawCenter("EXÉRCITO BRASILEIRO", 11, true)
  drawCenter("COLOG    Ba Ap Log", 11, true)
  drawCenter("BATALHÃO CENTRAL DE MANUTENÇÃO E SUPRIMENTO", 11, true)
  drawCenter("(Batalhão Marechal Dutra)", 10, true)
  y -= 8

  draw(`DIEx Requisitório nº ${r.numero_diex} – ${r.de}/BCMS`, 12, false)
  draw(`NUP: ${r.nup}`, 12, false)
  y -= 4
  const rightDate = `Rio de Janeiro-RJ, ${formatDatePtBrLong(r.data_req)}`
  const rightDateW = font.widthOfTextAtSize(rightDate, 11)
  page.drawText(rightDate, { x: pageW - margin - rightDateW, y, size: 11, font })
  y -= lineH + 6

  page.drawText("Do", { x: margin, y, size: 11, font: fontBold }); page.drawText(` ${r.de}`, { x: margin + 15, y, size: 11, font }); y -= lineH
  page.drawText("Ao", { x: margin, y, size: 11, font: fontBold }); page.drawText(` ${r.para}`, { x: margin + 15, y, size: 11, font }); y -= lineH
  page.drawText("Assunto:", { x: margin, y, size: 11, font: fontBold }); page.drawText(` ${r.assunto}`, { x: margin + 45, y, size: 11, font }); y -= lineH + 4

  drawJustifiedParagraph(
    `1. Nos termos do contido no Art. 13 das IG 12-02, solicito autorização para aquisição de material de Expediente em geral, como UG "${tipoUGLabel(r.tipo)}", do Pregão Eletrônico Nr ${r.nr_pregao} — BATALHÃO CENTRAL DE MANUTENÇÃO E SUPRIMENTO — UASG (${r.ug}). devido a necessidade de manutenção das viaturas operacionais deste batalhão de manutenção de viaturas militares.`,
    11
  )
  draw(`2. Fonte de recurso: ${fonteRecursoNC(r)}`, 11, false)
  draw(`3. Tipo de empenho: ${empenhoTipoLabel(r.empenho_tipo)}`, 11, false)
  draw(`4. Contrato: ${contratoLabel(r.contrato)}`, 11, false)
  draw(`5. Classe/Grupo PCA: ${r.classe_grupo_pca}`, 11, false)
  draw(`6. Nr contratação PCA: ${r.nr_contratacao_pca}`, 11, false)
  y -= 6

  const groups = groupDetalhesByFornecedor(r.detalhes, "dados do fornecedor aqui")
  // Soma exata = maxW (pageW - 2*margin), garantindo margem igual nos dois lados.
  const colWidths = [38, 46, 188, 40, 40, 70, 77]
  const colXs = [margin]
  for (const w of colWidths) colXs.push(colXs[colXs.length - 1] + w)
  const baseRowH = 16

  function drawTableGroup(fornecedor: string, itens: RequisicaoDocumentRow["detalhes"]) {
    const cellFont = 8
    const hPad = 3
    const vPad = 4

    function fitNoWrap(txt: string, maxWidth: number, preferred = cellFont) {
      let size = preferred
      while (size > 6 && font.widthOfTextAtSize(txt, size) > maxWidth) size -= 0.5
      return Math.max(6, size)
    }

    const headerHeight = baseRowH
    const rows = itens.map((d) => {
      const item = [d.nr_item]
      const sub = [d.subitem]
      const desc = wrapWithinWidth(d.descricao, colWidths[2] - hPad * 2, cellFont, false)
      const und = wrapWithinWidth(d.und, colWidths[3] - hPad * 2, cellFont, false)
      const qtd = [String(d.qtd)]
      const vUnit = [formatMoneyBr(d.valor_unitario)]
      const vTot = [formatMoneyBr(d.valor_total)] // nunca quebra
      const maxLines = Math.max(item.length, sub.length, desc.length, und.length, qtd.length, vUnit.length, vTot.length)
      const height = Math.max(baseRowH, maxLines * 10 + vPad * 2)
      return { d, item, sub, desc, und, qtd, vUnit, vTot, height }
    })
    const total = itens.reduce((s, d) => s + d.valor_total, 0)
    const totalHeight = baseRowH
    const tableRowsHeight = headerHeight + rows.reduce((acc, r) => acc + r.height, 0) + totalHeight
    const neededH = tableRowsHeight + 44
    if (y < margin + neededH) {
      page = pdf.addPage([pageW, pageH])
      y = pageH - margin
    }

    draw(`FORNECEDOR: ${fornecedor || "dados do fornecedor aqui"}`, 10, true)
    y -= 6

    const top = y
    let currentY = top
    const totalH = tableRowsHeight

    // Bordas verticais: externas em toda altura; internas só até antes da linha de total (célula mesclada à esquerda).
    page.drawLine({
      start: { x: colXs[0], y: top },
      end: { x: colXs[0], y: top - totalH },
      thickness: 1,
      color: rgb(0, 0, 0),
    })
    page.drawLine({
      start: { x: colXs[colXs.length - 1], y: top },
      end: { x: colXs[colXs.length - 1], y: top - totalH },
      thickness: 1,
      color: rgb(0, 0, 0),
    })
    const totalTopY = top - (headerHeight + rows.reduce((acc, r) => acc + r.height, 0))
    for (let i = 1; i < colXs.length - 1; i++) {
      const x = colXs[i]
      const isSplitBeforeLastCol = i === colXs.length - 2 // separa coluna do valor total
      page.drawLine({
        start: { x, y: top },
        end: { x, y: isSplitBeforeLastCol ? top - totalH : totalTopY },
        thickness: 1,
        color: rgb(0, 0, 0),
      })
    }
    page.drawLine({ start: { x: colXs[0], y: currentY }, end: { x: colXs[colXs.length - 1], y: currentY }, thickness: 1, color: rgb(0, 0, 0) })
    currentY -= headerHeight
    page.drawLine({ start: { x: colXs[0], y: currentY }, end: { x: colXs[colXs.length - 1], y: currentY }, thickness: 1, color: rgb(0, 0, 0) })
    for (const rRow of rows) {
      currentY -= rRow.height
      page.drawLine({ start: { x: colXs[0], y: currentY }, end: { x: colXs[colXs.length - 1], y: currentY }, thickness: 1, color: rgb(0, 0, 0) })
    }
    currentY -= totalHeight
    page.drawLine({ start: { x: colXs[0], y: currentY }, end: { x: colXs[colXs.length - 1], y: currentY }, thickness: 1, color: rgb(0, 0, 0) })

    const header = ["ITEM", "SUBITEM", "DESCRIÇÃO", "UND", "QTDE", "V. UNIT", "V. TOTAL"]
    header.forEach((h, i) => {
      const hSize = fitNoWrap(h, colWidths[i] - hPad * 2, 8)
      const hWidth = fontBold.widthOfTextAtSize(h, hSize)
      const hx = colXs[i] + (colWidths[i] - hWidth) / 2
      page.drawText(h, { x: hx, y: top - headerHeight + 5, size: hSize, font: fontBold })
    })

    let rowTop = top - headerHeight
    rows.forEach((rw) => {
      const yBase = rowTop - vPad - 8
      const drawCellLines = (lines: string[], colIdx: number, align: "left" | "center" | "right" = "left", fixedSize = cellFont) => {
        lines.forEach((ln, idx) => {
          const yy = yBase - idx * 10
          const w = font.widthOfTextAtSize(ln, fixedSize)
          let xx = colXs[colIdx] + hPad
          if (align === "center") xx = colXs[colIdx] + (colWidths[colIdx] - w) / 2
          if (align === "right") xx = colXs[colIdx + 1] - hPad - w
          page.drawText(ln, { x: xx, y: yy, size: fixedSize, font })
        })
      }
      drawCellLines(rw.item, 0, "center")
      drawCellLines(rw.sub, 1, "center")
      drawCellLines(rw.desc, 2, "left")
      drawCellLines(rw.und, 3, "center")
      drawCellLines(rw.qtd, 4, "center")
      drawCellLines(rw.vUnit, 5, "right")
      const totalSize = fitNoWrap(rw.vTot[0], colWidths[6] - hPad * 2, cellFont)
      drawCellLines(rw.vTot, 6, "right", totalSize)
      rowTop -= rw.height
    })

    const totalLabel = "TOTAL DO FORNECEDOR"
    const mergedWidth = colWidths.slice(0, 6).reduce((a, b) => a + b, 0)
    const totalLabelSize = fitNoWrap(totalLabel, mergedWidth - hPad * 2, 8)
    const totalLabelWidth = fontBold.widthOfTextAtSize(totalLabel, totalLabelSize)
    page.drawText(totalLabel, {
      x: colXs[0] + (mergedWidth - totalLabelWidth) / 2,
      y: rowTop - totalHeight + 5,
      size: totalLabelSize,
      font: fontBold,
    })
    const totalText = formatMoneyBr(total)
    const totalTextSize = fitNoWrap(totalText, colWidths[6] - hPad * 2, 8)
    const totalW = fontBold.widthOfTextAtSize(totalText, totalTextSize)
    page.drawText(formatMoneyBr(total), {
      x: colXs[7] - hPad - totalW,
      y: rowTop - totalHeight + 5,
      size: totalTextSize,
      font: fontBold,
    })

    y = top - totalH - 14
  }

  for (const g of groups) {
    for (const part of chunk(g.itens, 12)) {
      drawTableGroup(g.fornecedor, part)
    }
  }

  page = pdf.addPage([pageW, pageH])
  y = pageH - margin
  drawCenter("DESPACHO", 12, true)
  y -= 8
  draw("APROVAÇÃO DO FISCAL ADMINISTRATIVO", 10, true)
  draw("Aprovo a aquisição do material solicitado, conforme descrito na requisição.", 10, false)
  y -= 8
  draw("VÍTOR CESAR VELASCO FAVARO – 1º TEN", 10, true)
  draw("Fiscal Administrativo", 10, false)
  y -= 12
  draw("DESPACHO DO ORDENADOR DE DESPESAS", 10, true)
  draw("Autorizo a aquisição do material solicitado, conforme descrito.", 10, false)
  draw("Seja enviada a requisição à SALC desta UG para as providências cabíveis.", 10, false)
  y -= 8
  draw("JONATHAS DA COSTA JARDIM – TEN CEL", 10, true)
  draw("OD do BCMS", 10, false)

  const bytes = await pdf.save()
  return Buffer.from(bytes)
}
