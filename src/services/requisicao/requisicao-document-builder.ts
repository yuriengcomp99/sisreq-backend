import {
  AlignmentType,
  BorderStyle,
  Document,
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
import type { RequisicaoDocumentRow } from "./requisicao-document-helpers.js"
import {
  contratoLabel,
  empenhoTipoLabel,
  fonteRecursoTexto,
  formatDatePtBrLong,
  formatMoneyBr,
  fornecedorLinha,
  nomeAssinante,
} from "./requisicao-document-helpers.js"

function headerParagraphs(): Paragraph[] {
  const lines = [
    "MINISTÉRIO DA DEFESA EXÉRCITO BRASILEIRO",
    "COLOG Ba Ap Log",
    "BATALHÃO CENTRAL DE MANUTENÇÃO E SUPRIMENTO",
    "(Batalhão Marechal Dutra)",
  ]
  return lines.map(
    (t) =>
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: t,
            bold: true,
            size: 20,
          }),
        ],
        spacing: { after: 120 },
      })
  )
}

function cellBorder() {
  return {
    top: { style: BorderStyle.SINGLE, size: 1, color: "333333" },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: "333333" },
    left: { style: BorderStyle.SINGLE, size: 1, color: "333333" },
    right: { style: BorderStyle.SINGLE, size: 1, color: "333333" },
  }
}

export async function buildRequisicaoDocx(
  r: RequisicaoDocumentRow
): Promise<Buffer> {
  const totalItens = r.detalhes.reduce((s, d) => s + d.valor_total, 0)

  const diex = new Paragraph({
    children: [
      new TextRun({ text: "DIEx Requisitório nº ", size: 22 }),
      new TextRun({ text: r.numero_diex, bold: true, size: 22 }),
      new TextRun({ text: ` – ${r.de} `, size: 22 }),
      new TextRun({ text: "NUP: ", bold: true, size: 22 }),
      new TextRun({ text: r.nup, bold: true, size: 22 }),
    ],
    spacing: { before: 200, after: 120 },
  })

  const dataLocal = new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: `Rio de Janeiro-RJ, ${formatDatePtBrLong(r.data_req)}`,
        size: 22,
      }),
    ],
    spacing: { after: 160 },
  })

  const doPara = [
    new Paragraph({
      spacing: { before: 80 },
      children: [
        new TextRun({ text: "Do ", bold: true, size: 24 }),
        new TextRun({ text: r.de, size: 24 }),
      ],
    }),
    new Paragraph({
      spacing: { before: 160 },
      children: [
        new TextRun({ text: "Ao ", bold: true, size: 24 }),
        new TextRun({ text: `${r.para} `, size: 24 }),
        new TextRun({ text: "Assunto", bold: true, size: 24 }),
        new TextRun({ text: `: ${r.assunto}`, size: 24 }),
      ],
    }),
  ]

  const corpo1 = new Paragraph({
    spacing: { before: 160 },
    alignment: AlignmentType.JUSTIFIED,
    children: [
      new TextRun({
        text:
          "Nos termos do contido no Art. 13 das IG 12-02, solicito autorização para atender à necessidade abaixo, como ",
        size: 24,
      }),
      new TextRun({ text: r.tipo, bold: true, size: 24 }),
      new TextRun({
        text: `, do Pregão Eletrônico Nr ${r.nr_pregao}, `,
        size: 24,
      }),
      new TextRun({ text: r.nome_da_ug, bold: true, size: 24 }),
      new TextRun({ text: `, UASG (${r.ug}). `, size: 24 }),
      new TextRun({ text: r.descricao_necessidade, size: 24 }),
    ],
  })

  const corpo2 = new Paragraph({
    spacing: { before: 120 },
    alignment: AlignmentType.JUSTIFIED,
    children: [
      new TextRun({ text: "Fonte de Recurso: ", size: 24 }),
      new TextRun({
        text: fonteRecursoTexto(r.notaCredito),
        bold: true,
        size: 24,
      }),
    ],
  })

  const corpo3 = new Paragraph({
    spacing: { before: 120 },
    children: [
      new TextRun({ text: "Tipo de Empenho: ", size: 24 }),
      new TextRun({
        text: `${empenhoTipoLabel(r.empenho_tipo)}.`,
        bold: true,
        size: 24,
      }),
    ],
  })

  const corpo4 = new Paragraph({
    spacing: { before: 120 },
    children: [
      new TextRun({ text: "Contrato: ", size: 24 }),
      new TextRun({
        text: contratoLabel(r.contrato),
        bold: true,
        size: 24,
      }),
    ],
  })

  const corpo5 = new Paragraph({
    spacing: { before: 120 },
    alignment: AlignmentType.JUSTIFIED,
    children: [
      new TextRun({ text: "Classe/Grupo PCA: ", size: 24 }),
      new TextRun({ text: r.classe_grupo_pca, bold: true, size: 24 }),
    ],
  })

  const corpo6 = new Paragraph({
    spacing: { before: 120 },
    children: [
      new TextRun({ text: "Nr da contratação PCA: ", size: 24 }),
      new TextRun({ text: r.nr_contratacao_pca, bold: true, size: 24 }),
    ],
  })

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
            children: [
              new TextRun({
                text: fornecedorLinha(r.notaCredito),
                bold: true,
                size: 20,
              }),
            ],
          }),
        ],
      }),
    ],
  })

  const headerRow = new TableRow({
    children: ["ITEM", "SI", "DESCRIÇÃO", "UND", "QTDE", "VALOR UNIT", "VALOR TOTAL"].map(
      (h) =>
        new TableCell({
          verticalAlign: VerticalAlign.CENTER,
          margins: { top: 60, bottom: 60, left: 60, right: 60 },
          borders: cellBorder(),
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: h, bold: true, size: 22 }),
              ],
            }),
          ],
        })
    ),
  })

  const itemRows = r.detalhes.map(
    (d) =>
      new TableRow({
        children: [
          new TableCell({
            borders: cellBorder(),
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: d.nr_item, size: 20 })],
              }),
            ],
          }),
          new TableCell({
            borders: cellBorder(),
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: d.subitem, size: 20 })],
              }),
            ],
          }),
          new TableCell({
            borders: cellBorder(),
            children: [
              new Paragraph({
                children: [new TextRun({ text: d.descricao, size: 20 })],
              }),
            ],
          }),
          new TableCell({
            borders: cellBorder(),
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: d.und, size: 20 })],
              }),
            ],
          }),
          new TableCell({
            borders: cellBorder(),
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: String(d.qtd), size: 20 })],
              }),
            ],
          }),
          new TableCell({
            borders: cellBorder(),
            children: [
              new Paragraph({
                alignment: AlignmentType.END,
                children: [
                  new TextRun({
                    text: formatMoneyBr(d.valor_unitario),
                    size: 20,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            borders: cellBorder(),
            children: [
              new Paragraph({
                alignment: AlignmentType.END,
                children: [
                  new TextRun({
                    text: formatMoneyBr(d.valor_total),
                    size: 20,
                  }),
                ],
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
            children: [
              new TextRun({
                text: "TOTAL DO FORNECEDOR",
                bold: true,
                size: 20,
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        borders: cellBorder(),
        children: [
          new Paragraph({
            alignment: AlignmentType.END,
            children: [
              new TextRun({
                text: formatMoneyBr(totalItens),
                size: 20,
              }),
            ],
          }),
        ],
      }),
    ],
  })

  const tabela = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [fornecedorRow, headerRow, ...itemRows, totalRow],
  })

  const assinatura = new Paragraph({
    spacing: { before: 360 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: `${nomeAssinante(r.user)} – ${r.user.graduation}`,
        size: 22,
      }),
    ],
  })

  const cargo = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
    children: [
      new TextRun({
        text: "Chefe do setor de almoxarifado",
        size: 22,
      }),
    ],
  })

  const despachoTitulo = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200 },
    children: [
      new TextRun({
        text: "DESPACHO",
        bold: true,
        underline: {},
        size: 24,
      }),
    ],
  })

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          ...headerParagraphs(),
          diex,
          dataLocal,
          ...doPara,
          corpo1,
          corpo2,
          corpo3,
          corpo4,
          corpo5,
          corpo6,
          new Paragraph({
            spacing: { after: 160 },
            children: [new TextRun("")],
          }),
          tabela,
          assinatura,
          cargo,
          despachoTitulo,
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
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold)

  const pageW = 595.28
  const pageH = 841.89
  const margin = 48
  let page = pdf.addPage([pageW, pageH])
  let y = pageH - margin
  const lineH = 12
  const maxW = pageW - 2 * margin

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

  drawCenter("MINISTÉRIO DA DEFESA — EXÉRCITO BRASILEIRO", 10, true)
  drawCenter("BATALHÃO CENTRAL DE MANUTENÇÃO E SUPRIMENTO (BCMS)", 10, true)
  y -= 8

  draw(
    `DIEx Requisitório nº ${r.numero_diex} – ${r.de}  NUP: ${r.nup}`,
    11,
    false
  )
  y -= 4
  draw(`Rio de Janeiro-RJ, ${formatDatePtBrLong(r.data_req)}`, 10, false)
  y -= 8
  draw(`Do ${r.de}`, 10, true)
  draw(`Ao ${r.para}  Assunto: ${r.assunto}`, 10, false)
  y -= 6

  draw(
    `Pregão Eletrônico Nr ${r.nr_pregao} — ${r.nome_da_ug} — UASG (${r.ug}). ${r.descricao_necessidade}`,
    10,
    false
  )
  draw(`Fonte de recurso: ${fonteRecursoTexto(r.notaCredito)}`, 10, true)
  draw(`Tipo de empenho: ${empenhoTipoLabel(r.empenho_tipo)}`, 10, false)
  draw(`Contrato: ${contratoLabel(r.contrato)}`, 10, false)
  draw(`Classe/Grupo PCA: ${r.classe_grupo_pca}`, 10, false)
  draw(`Nr contratação PCA: ${r.nr_contratacao_pca}`, 10, false)
  y -= 6

  draw(`Fornecedor: ${fornecedorLinha(r.notaCredito)}`, 10, true)
  y -= 4

  draw(
    "ITEM | SI | DESCRIÇÃO | UND | QTD | V. UNIT | V. TOTAL",
    9,
    true
  )
  for (const d of r.detalhes) {
    draw(
      `${d.nr_item} | ${d.subitem} | ${d.descricao} | ${d.und} | ${d.qtd} | ${formatMoneyBr(d.valor_unitario)} | ${formatMoneyBr(d.valor_total)}`,
      9,
      false
    )
  }
  const total = r.detalhes.reduce((s, d) => s + d.valor_total, 0)
  draw(`TOTAL: ${formatMoneyBr(total)}`, 10, true)
  y -= 12

  draw(
    `${nomeAssinante(r.user)} — ${r.user.graduation}`,
    10,
    true
  )
  draw("Chefe do setor de almoxarifado", 9, false)

  const bytes = await pdf.save()
  return Buffer.from(bytes)
}
