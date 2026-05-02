import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  ImageRun,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  SectionType,
  VerticalAlign,
} from "docx"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import fs from "node:fs"
import path from "node:path"
import type { RequisicaoDocumentRow } from "./requisicao-document-helpers.js"
import {
  contratoLabel,
  DESPACHO_DATA_LOCAL_LINHA,
  empenhoTipoLabel,
  formatDatePtBrLong,
  formatMoneyBr,
  getDespachoAssinaturasFromEnv,
  groupDetalhesByFornecedor,
  requisitanteCargo,
} from "./requisicao-document-helpers.js"

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
  const ncExtras = nc as typeof nc & {
    uasg_ug_emitente?: string | null
    pi?: string | null
    nd?: string | null
  }
  return [
    nc.numero,
    nc.emitente,
    ncExtras.uasg_ug_emitente,
    ncExtras.pi,
    ncExtras.nd,
    nc.favorecido,
  ]
    .filter(Boolean)
    .join(" - ")
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
  detalhes: RequisicaoDocumentRow["detalhes"],
  options: { showFornecedorBanner: boolean }
): Table {
  const totalItens = detalhes.reduce((s, d) => s + d.valor_total, 0)

  const fornecedorBannerRow = options.showFornecedorBanner
    ? new TableRow({
        children: [
          new TableCell({
            columnSpan: 7,
            verticalAlign: VerticalAlign.CENTER,
            margins: { top: 60, bottom: 60, left: 120, right: 120 },
            borders: cellBorder(),
            shading: {
              type: ShadingType.CLEAR,
              fill: "E8E8E8",
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [tr(fornecedor, { bold: true, size: 20 })],
              }),
            ],
          }),
        ],
      })
    : null

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

  const rows = [
    ...(fornecedorBannerRow ? [fornecedorBannerRow] : []),
    headerRow,
    ...itemRows,
    totalRow,
  ]

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows,
  })
}

function despachoCellParagraphs(side: "fiscal" | "od"): Paragraph[] {
  const assin = getDespachoAssinaturasFromEnv()
  const fiscalNome = assin.fiscalNome || " "
  const fiscalCargo = assin.fiscalCargo
  const odNome = assin.odNome || " "
  const odCargo = assin.odCargo

  /** Espaço só entre a linha da data e o nome (assinatura), em twips. */
  const espacoAposDataAntesNome = 560
  /** Pouco espaço entre o texto do despacho e a linha da data. */
  const espacoAposTextoAntesData = 16

  if (side === "fiscal") {
    return [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          tr("APROVAÇÃO DO FISCAL ADMINISTRATIVO", { bold: true, underline: {}, size: 22 }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: espacoAposTextoAntesData },
        children: [
          tr("Aprovo a aquisição do material solicitado, conforme descrito na requisição.", {
            size: 22,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: espacoAposDataAntesNome },
        children: [tr(DESPACHO_DATA_LOCAL_LINHA, { size: 22 })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [tr(fiscalNome, { bold: true, size: 22 })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [tr(fiscalCargo, { bold: true, size: 22 })],
      }),
    ]
  }

  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        tr("DESPACHO DO ORDENADOR DE DESPESAS", { bold: true, underline: {}, size: 22 }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 120 },
      children: [
        tr("1. Autorizo a aquisição do material solicitado, conforme descrito.", { size: 22 }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: espacoAposTextoAntesData },
      children: [
        tr(
          "2. Seja enviada a requisição à SALC desta UG para as providências cabíveis.",
          { size: 22 }
        ),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: espacoAposDataAntesNome },
      children: [tr(DESPACHO_DATA_LOCAL_LINHA, { size: 22 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [tr(odNome, { bold: true, size: 22 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [tr(odCargo, { bold: true, size: 22 })],
    }),
  ]
}

function buildDefaultFooterDocx(r: RequisicaoDocumentRow): Footer {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          tr("DIEx Requisitório nº ", { size: 18 }),
          tr(r.numero_diex, { size: 18 }),
          tr(" – ", { size: 18 }),
          tr(`${r.de}/BCMS - NUP: `, { size: 18 }),
          tr(r.nup, { size: 18 }),
        ],
      }),
    ],
  })
}

/** Após as tabelas de itens: requisitante (nome, posto/graduação, cargo). */
function requisitanteAssinaturaParagraphs(r: RequisicaoDocumentRow): Paragraph[] {
  const u = r.user
  const fn = u.first_name?.trim() || "—"
  const pg = u.graduation?.trim() || "—"
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 },
      children: [
        tr(fn, { bold: true, size: 24 }),
        tr(" – ", { size: 24 }),
        tr(pg, { bold: true, size: 24 }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [tr(requisitanteCargo(u), { bold: true, size: 24 })],
    }),
  ]
}

function buildDespachoTableDocx(): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.BOTTOM,
            borders: cellBorder(),
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
            children: despachoCellParagraphs("fiscal"),
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.BOTTOM,
            borders: cellBorder(),
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
            children: despachoCellParagraphs("od"),
          }),
        ],
      }),
    ],
  })
}

export async function buildRequisicaoDocx(
  r: RequisicaoDocumentRow
): Promise<Buffer> {
  const groups = groupDetalhesByFornecedor(
    r.detalhes,
    "FORNECEDOR NÃO INFORMADO"
  )
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
      tablesContent.push(
        buildFornecedorTable(g.fornecedor, part, {
          showFornecedorBanner: true,
        })
      )
    }
  }

  const despachoTitulo = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80, after: 200 },
    children: [tr("DESPACHO", { bold: true, underline: {}, size: 26 })],
  })

  const despachoTabela = buildDespachoTableDocx()

  const doc = new Document({
    sections: [
      {
        footers: {
          default: buildDefaultFooterDocx(r),
        },
        properties: {},
        children: [
          ...headerParagraphs(),
          new Paragraph({
            spacing: { before: 160, after: 80 },
            children: [
              tr("DIEx Requisitório nº ", { size: 24 }),
              tr(r.numero_diex, { size: 24 }),
              tr(" – ", { size: 24 }),
              tr(r.de, { size: 24 }),
              tr("/BCMS", { size: 24 }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [tr("NUP: ", { size: 24 }), tr(r.nup, { size: 24 })],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { after: 140 },
            children: [
              tr("Rio de Janeiro-RJ, ", { size: 24 }),
              tr(formatDatePtBrLong(r.data_req), { size: 24 }),
            ],
          }),
          new Paragraph({
            spacing: { after: 80 },
            children: [tr("Do ", { bold: true, size: 24 }), tr(r.de, { bold: true, size: 24 })],
          }),
          new Paragraph({
            spacing: { after: 60 },
            children: [tr("Ao ", { bold: true, size: 24 }), tr(r.para, { bold: true, size: 24 })],
          }),
          new Paragraph({
            spacing: { after: 140 },
            children: [tr("Assunto: ", { bold: true, size: 24 }), tr(r.assunto, { bold: true, size: 24 })],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 120 },
            children: [
              tr("1. Nos termos do contido no Art. 13 das IG 12-02, solicito autorização para aquisição/contratação de material/serviço descrito na tabela, como UG ", { size: 24 }),
              tr(`"${tipoUGLabel(r.tipo)}"`, { bold: true, size: 24 }),
              tr(", do Pregão Eletrônico Nr ", { size: 24 }),
              tr(r.nr_pregao, { bold: true, size: 24 }),
              tr(" — BATALHÃO CENTRAL DE MANUTENÇÃO E SUPRIMENTO — UASG (", { size: 24 }),
              tr(r.ug, { bold: true, size: 24 }),
              tr("). devido a necessidade de manutenção das viaturas operacionais deste batalhão de manutenção de viaturas militares.", { size: 24 }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 120 },
            children: [
              tr("2. Fonte de recurso: ", { size: 24 }),
              tr(fonteRecursoNC(r), { bold: true, size: 24 }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              tr("3. Tipo de empenho: ", { size: 24 }),
              tr(empenhoTipoLabel(r.empenho_tipo), { bold: true, size: 24 }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              tr("4. Contrato: ", { size: 24 }),
              tr(contratoLabel(r.contrato), { bold: true, size: 24 }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              tr("5. Classe/Grupo PCA: ", { size: 24 }),
              tr(r.classe_grupo_pca, { bold: true, size: 24 }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              tr("6. Nr contratação PCA: ", { size: 24 }),
              tr(r.nr_contratacao_pca, { bold: true, size: 24 }),
            ],
          }),
          ...tablesContent,
          ...requisitanteAssinaturaParagraphs(r),
        ],
      },
      {
        footers: {
          default: buildDefaultFooterDocx(r),
        },
        properties: {
          type: SectionType.NEXT_PAGE,
        },
        children: [despachoTitulo, despachoTabela],
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
  /** Área reservada na base para o rodapé (texto desenhado ao final em todas as páginas). */
  const FOOTER_RESERVED = 36
  const minContentY = margin + FOOTER_RESERVED
  let page = pdf.addPage([pageW, pageH])
  let y = pageH - margin
  const lineH = 12
  const maxW = pageW - 2 * margin
  const imageData = readModelImage()

  function ensureSpace(lines = 1) {
    if (y - lines * lineH < minContentY) {
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

  /** Linha centralizada com trechos em negrito (variáveis). */
  function drawCenterMixed(
    parts: readonly { text: string; bold: boolean }[],
    size: number,
    advanceY = lineH + 2
  ) {
    ensureSpace()
    const widths = parts.map((p) =>
      (p.bold ? fontBold : font).widthOfTextAtSize(p.text, size)
    )
    const totalW = widths.reduce((a, b) => a + b, 0)
    let x = (pageW - totalW) / 2
    for (let i = 0; i < parts.length; i++) {
      const f = parts[i]!.bold ? fontBold : font
      page.drawText(parts[i]!.text, {
        x,
        y,
        size,
        font: f,
        color: rgb(0, 0, 0),
      })
      x += widths[i]!
    }
    y -= advanceY
  }

  function drawLeftMixedLine(
    parts: readonly { text: string; bold: boolean }[],
    size: number
  ) {
    ensureSpace()
    let x = margin
    for (const p of parts) {
      const f = p.bold ? fontBold : font
      page.drawText(p.text, { x, y, size, font: f, color: rgb(0, 0, 0) })
      x += f.widthOfTextAtSize(p.text, size)
    }
    y -= lineH
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

  drawLeftMixedLine(
    [
      { text: "DIEx Requisitório nº ", bold: false },
      { text: r.numero_diex, bold: false },
      { text: " – ", bold: false },
      { text: `${r.de}/BCMS`, bold: false },
    ],
    12
  )
  drawLeftMixedLine(
    [
      { text: "NUP: ", bold: false },
      { text: r.nup, bold: false },
    ],
    12
  )
  y -= 4
  {
    const dateParts = [
      { text: "Rio de Janeiro-RJ, ", bold: false },
      { text: formatDatePtBrLong(r.data_req), bold: false },
    ] as const
    const dw = dateParts.map((p) =>
      (p.bold ? fontBold : font).widthOfTextAtSize(p.text, 11)
    )
    const dateTotal = dw.reduce((a, b) => a + b, 0)
    let dx = pageW - margin - dateTotal
    ensureSpace()
    for (let i = 0; i < dateParts.length; i++) {
      const f = dateParts[i]!.bold ? fontBold : font
      page.drawText(dateParts[i]!.text, { x: dx, y, size: 11, font: f })
      dx += dw[i]!
    }
    y -= lineH + 6
  }

  drawLeftMixedLine(
    [
      { text: "Do ", bold: true },
      { text: r.de, bold: true },
    ],
    11
  )
  drawLeftMixedLine(
    [
      { text: "Ao ", bold: true },
      { text: r.para, bold: true },
    ],
    11
  )
  drawLeftMixedLine(
    [
      { text: "Assunto: ", bold: true },
      { text: r.assunto, bold: true },
    ],
    11
  )
  y -= 4

  drawJustifiedParagraph(
    `1. Nos termos do contido no Art. 13 das IG 12-02, solicito autorização para aquisição/contratação de material/serviço descrito na tabela, como UG "${tipoUGLabel(r.tipo)}", do Pregão Eletrônico Nr ${r.nr_pregao} — BATALHÃO CENTRAL DE MANUTENÇÃO E SUPRIMENTO — UASG (${r.ug}). devido a necessidade de manutenção das viaturas operacionais deste batalhão de manutenção de viaturas militares.`,
    11
  )
  drawLeftMixedLine(
    [
      { text: "2. Fonte de recurso: ", bold: false },
      { text: fonteRecursoNC(r), bold: true },
    ],
    11
  )
  drawLeftMixedLine(
    [
      { text: "3. Tipo de empenho: ", bold: false },
      { text: empenhoTipoLabel(r.empenho_tipo), bold: true },
    ],
    11
  )
  drawLeftMixedLine(
    [
      { text: "4. Contrato: ", bold: false },
      { text: contratoLabel(r.contrato), bold: true },
    ],
    11
  )
  drawLeftMixedLine(
    [
      { text: "5. Classe/Grupo PCA: ", bold: false },
      { text: r.classe_grupo_pca, bold: true },
    ],
    11
  )
  drawLeftMixedLine(
    [
      { text: "6. Nr contratação PCA: ", bold: false },
      { text: r.nr_contratacao_pca, bold: true },
    ],
    11
  )
  y -= 6

  const groups = groupDetalhesByFornecedor(
    r.detalhes,
    "FORNECEDOR NÃO INFORMADO"
  )
  // Soma exata = maxW (pageW - 2*margin), garantindo margem igual nos dois lados.
  const colWidths = [38, 46, 188, 40, 40, 70, 77]
  const colXs = [margin]
  for (const w of colWidths) colXs.push(colXs[colXs.length - 1] + w)
  const baseRowH = 16

  function drawTableGroup(
    fornecedor: string,
    itens: RequisicaoDocumentRow["detalhes"],
    showFornecedorBanner: boolean
  ) {
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
    const label = fornecedor || "FORNECEDOR NÃO INFORMADO"
    const bannerFontSize = 8
    const bannerLines = showFornecedorBanner
      ? wrapWithinWidth(
          label,
          colXs[colXs.length - 1] - colXs[0] - 8,
          bannerFontSize,
          true
        )
      : []
    const bannerH = showFornecedorBanner
      ? Math.max(22, bannerLines.length * 10 + 14)
      : 0
    const tableRowsHeight = headerHeight + rows.reduce((acc, row) => acc + row.height, 0) + totalHeight
    const neededH = tableRowsHeight + 44 + bannerH + (showFornecedorBanner ? 8 : 0)
    if (y - neededH < minContentY) {
      page = pdf.addPage([pageW, pageH])
      y = pageH - margin
    }

    let tableTop = y
    if (showFornecedorBanner) {
      const bannerTop = tableTop
      const bannerBottom = tableTop - bannerH
      page.drawRectangle({
        x: colXs[0],
        y: bannerBottom,
        width: colXs[colXs.length - 1] - colXs[0],
        height: bannerTop - bannerBottom,
        color: rgb(0.91, 0.91, 0.91),
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.5,
      })
      let by = bannerTop - 10
      for (const ln of bannerLines) {
        const lw = fontBold.widthOfTextAtSize(ln, bannerFontSize)
        page.drawText(ln, {
          x: (pageW - lw) / 2,
          y: by,
          size: bannerFontSize,
          font: fontBold,
          color: rgb(0, 0, 0),
        })
        by -= 10
      }
      tableTop = bannerBottom - 8
    }

    let currentY = tableTop
    const totalH = tableRowsHeight

    // Bordas verticais: externas em toda altura; internas só até antes da linha de total (célula mesclada à esquerda).
    page.drawLine({
      start: { x: colXs[0], y: tableTop },
      end: { x: colXs[0], y: tableTop - totalH },
      thickness: 1,
      color: rgb(0, 0, 0),
    })
    page.drawLine({
      start: { x: colXs[colXs.length - 1], y: tableTop },
      end: { x: colXs[colXs.length - 1], y: tableTop - totalH },
      thickness: 1,
      color: rgb(0, 0, 0),
    })
    const totalTopY = tableTop - (headerHeight + rows.reduce((acc, row) => acc + row.height, 0))
    for (let i = 1; i < colXs.length - 1; i++) {
      const x = colXs[i]
      const isSplitBeforeLastCol = i === colXs.length - 2 // separa coluna do valor total
      page.drawLine({
        start: { x, y: tableTop },
        end: { x, y: isSplitBeforeLastCol ? tableTop - totalH : totalTopY },
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
      page.drawText(h, { x: hx, y: tableTop - headerHeight + 5, size: hSize, font: fontBold })
    })

    let rowTop = tableTop - headerHeight
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

    y = tableTop - totalH - 14
  }

  for (const g of groups) {
    for (const part of chunk(g.itens, 12)) {
      drawTableGroup(g.fornecedor, part, true)
    }
  }

  y -= 20
  const uPdf = r.user
  drawCenterMixed(
    [
      { text: uPdf.first_name?.trim() || "—", bold: true },
      { text: " – ", bold: false },
      { text: uPdf.graduation?.trim() || "—", bold: true },
    ],
    11
  )
  drawCenter(requisitanteCargo(r.user), 11, true)
  y -= 28

  page = pdf.addPage([pageW, pageH])
  y = pageH - margin

  const assinPdf = getDespachoAssinaturasFromEnv()
  const colGap = 10
  const innerColW = (maxW - colGap) / 2
  const leftColX = margin
  const rightColX = margin + innerColW + colGap
  const midX = margin + innerColW + colGap / 2
  /** Respiro entre o fim do texto do despacho e a linha da data (mínimo). */
  const PDF_PAD_TEXTO_DATA = 0
  /** Espaço entre a linha da data (____/____/_____) e o nome, fiscal e OD. */
  const PDF_GAP_DATA_NOME = 42

  type PdfLine = { text: string; size: number; bold?: boolean; center?: boolean; justify?: boolean }

  const leftTopBlocks: PdfLine[] = [
    { text: "APROVAÇÃO DO FISCAL ADMINISTRATIVO", size: 9, bold: true, center: true },
    {
      text: "Aprovo a aquisição do material solicitado, conforme descrito na requisição.",
      size: 9,
      justify: true,
    },
  ]
  const rightTopBlocks: PdfLine[] = [
    { text: "DESPACHO DO ORDENADOR DE DESPESAS", size: 9, bold: true, center: true },
    {
      text: "1. Autorizo a aquisição do material solicitado, conforme descrito.",
      size: 9,
      justify: true,
    },
    {
      text: "2. Seja enviada a requisição à SALC desta UG para as providências cabíveis.",
      size: 9,
      justify: true,
    },
  ]

  function heightOfPdfTopBlocks(blocks: PdfLine[], innerW: number): number {
    let h = 0
    for (const b of blocks) {
      const lines = b.justify
        ? wrapWithinWidth(b.text, innerW - 6, b.size, false)
        : b.center
          ? wrapWithinWidth(b.text, innerW - 6, b.size, !!b.bold)
          : wrapLine(b.text, b.size, !!b.bold)
      h += Math.max(1, lines.length) * (b.size + 3)
      h += 4
    }
    return h + 8
  }

  function heightPdfBottomStack(dateStr: string, nome: string, cargo: string, innerW: number): number {
    const cw = innerW - 6
    const dateLines = wrapWithinWidth(dateStr, cw, 9, false).length
    const nomeLines = wrapWithinWidth(nome || " ", cw, 9, true).length
    return dateLines * 12 + PDF_GAP_DATA_NOME + nomeLines * 12 + 12 + 14
  }

  const hLeftBottom = heightPdfBottomStack(
    DESPACHO_DATA_LOCAL_LINHA,
    assinPdf.fiscalNome || " ",
    assinPdf.fiscalCargo,
    innerColW
  )
  const hRightBottom = heightPdfBottomStack(
    DESPACHO_DATA_LOCAL_LINHA,
    assinPdf.odNome || " ",
    assinPdf.odCargo,
    innerColW
  )
  const hLeftTop = heightOfPdfTopBlocks(leftTopBlocks, innerColW)
  const hRightTop = heightOfPdfTopBlocks(rightTopBlocks, innerColW)
  const rowH = Math.max(
    hLeftTop + PDF_PAD_TEXTO_DATA + hLeftBottom,
    hRightTop + PDF_PAD_TEXTO_DATA + hRightBottom,
    200
  )

  drawCenter("DESPACHO", 12, true)
  y -= 10
  const rowTopFinal = y

  page.drawRectangle({
    x: margin,
    y: rowTopFinal - rowH,
    width: maxW,
    height: rowH,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
    color: rgb(1, 1, 1),
  })
  page.drawLine({
    start: { x: midX, y: rowTopFinal },
    end: { x: midX, y: rowTopFinal - rowH },
    thickness: 1,
    color: rgb(0, 0, 0),
  })

  const innerBottomY = rowTopFinal - rowH + 18

  function drawPdfTopColumn(x0: number, blocks: PdfLine[], yMin: number) {
    let yy = rowTopFinal - 12
    for (const b of blocks) {
      const f = b.bold ? fontBold : font
      if (b.justify) {
        const lines = wrapWithinWidth(b.text, innerColW - 6, b.size, false)
        for (let li = 0; li < lines.length; li++) {
          if (yy < yMin) return
          const ln = lines[li]
          const isLast = li === lines.length - 1
          if (isLast || !ln.includes(" ")) {
            page.drawText(ln, { x: x0 + 3, y: yy, size: b.size, font })
          } else {
            const words = ln.split(" ")
            const wordsWidth = words.reduce((acc, w) => acc + font.widthOfTextAtSize(w, b.size), 0)
            const slots = words.length - 1
            const spacing = slots > 0 ? (innerColW - 6 - wordsWidth) / slots : 0
            let xx = x0 + 3
            for (const [idx, w] of words.entries()) {
              page.drawText(w, { x: xx, y: yy, size: b.size, font })
              xx += font.widthOfTextAtSize(w, b.size)
              if (idx < slots) xx += spacing
            }
          }
          yy -= b.size + 3
        }
      } else if (b.center) {
        for (const ln of wrapWithinWidth(b.text, innerColW - 6, b.size, !!b.bold)) {
          if (yy < yMin) return
          const w = f.widthOfTextAtSize(ln, b.size)
          page.drawText(ln, {
            x: x0 + (innerColW - w) / 2,
            y: yy,
            size: b.size,
            font: f,
          })
          yy -= b.size + 3
        }
      }
      yy -= 4
    }
  }

  function drawPdfBottomColumn(
    x0: number,
    yBase: number,
    dateStr: string,
    nomeStr: string,
    cargoStr: string
  ) {
    const cw = innerColW - 6
    let yLine = yBase + 8
    const cwCargo = fontBold.widthOfTextAtSize(cargoStr, 9)
    page.drawText(cargoStr, {
      x: x0 + (innerColW - cwCargo) / 2,
      y: yLine,
      size: 9,
      font: fontBold,
    })
    yLine += 11
    for (const ln of wrapWithinWidth(nomeStr || " ", cw, 9, true)) {
      const w = fontBold.widthOfTextAtSize(ln, 9)
      page.drawText(ln, {
        x: x0 + (innerColW - w) / 2,
        y: yLine,
        size: 9,
        font: fontBold,
      })
      yLine += 11
    }
    yLine += PDF_GAP_DATA_NOME
    for (const ln of wrapWithinWidth(dateStr, cw, 9, false)) {
      const w = font.widthOfTextAtSize(ln, 9)
      page.drawText(ln, {
        x: x0 + (innerColW - w) / 2,
        y: yLine,
        size: 9,
        font,
      })
      yLine += 12
    }
  }

  const yFloorLeft = innerBottomY + hLeftBottom + PDF_PAD_TEXTO_DATA
  const yFloorRight = innerBottomY + hRightBottom + PDF_PAD_TEXTO_DATA
  drawPdfTopColumn(leftColX, leftTopBlocks, yFloorLeft)
  drawPdfTopColumn(rightColX, rightTopBlocks, yFloorRight)
  drawPdfBottomColumn(
    leftColX,
    innerBottomY,
    DESPACHO_DATA_LOCAL_LINHA,
    assinPdf.fiscalNome || " ",
    assinPdf.fiscalCargo
  )
  drawPdfBottomColumn(
    rightColX,
    innerBottomY,
    DESPACHO_DATA_LOCAL_LINHA,
    assinPdf.odNome || " ",
    assinPdf.odCargo
  )

  y = rowTopFinal - rowH - 20

  const footerSize = 7
  const footerParts = [
    { text: "DIEx Requisitório nº ", bold: false },
    { text: r.numero_diex, bold: false },
    { text: " – ", bold: false },
    { text: `${r.de}/BCMS - NUP: `, bold: false },
    { text: r.nup, bold: false },
  ] as const
  for (const pdfPage of pdf.getPages()) {
    const { width } = pdfPage.getSize()
    const fw = footerParts.map((p) =>
      (p.bold ? fontBold : font).widthOfTextAtSize(p.text, footerSize)
    )
    const total = fw.reduce((a, b) => a + b, 0)
    let fx = (width - total) / 2
    for (let i = 0; i < footerParts.length; i++) {
      const f = footerParts[i]!.bold ? fontBold : font
      pdfPage.drawText(footerParts[i]!.text, {
        x: fx,
        y: margin,
        size: footerSize,
        font: f,
        color: rgb(0, 0, 0),
      })
      fx += fw[i]!
    }
  }

  const bytes = await pdf.save()
  return Buffer.from(bytes)
}
