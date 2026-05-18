/**
 * SecureVault — batch prototype builder for Figma MCP `use_figma`.
 *
 * Prerequisites:
 * - Figma Desktop + MCP connected (Cursor shows Figma tools as connected).
 * - File key: 4vk6Tx1wKlJVOYjhIRyJb9
 *
 * Usage: In Cursor, ask the agent to run this file's contents through the Figma MCP
 * `use_figma` tool with fileKey "4vk6Tx1wKlJVOYjhIRyJb9" (paste the code as the `code` argument).
 *
 * What it does:
 * 1. Finds the "File Explorer" page and the first "SecureVault – App" frame as template.
 * 2. Creates a Section + 4 duplicated frames (same layer names → Smart Animate friendly).
 * 3. Tweaks selection accents + properties copy for PDF / DOCX / ZIP / breadcrumb states.
 * 4. Adds transparent hit-target rects for reliable clicks.
 * 5. Wires ON_CLICK → NAVIGATE + SMART_ANIMATE (and OVERLAY for preview).
 *
 * After running: In Figma, right‑click "Proto · 01 …" → **Set as prototype starting point**, then Present.
 */

const transition = {
  type: 'SMART_ANIMATE',
  easing: { type: 'EASE_IN_AND_OUT' },
  duration: 0.35,
}

function navTo(destId) {
  return {
    type: 'NODE',
    destinationId: destId,
    navigation: 'NAVIGATE',
    transition,
    resetScrollPosition: false,
  }
}

function overlayTo(destId) {
  return {
    type: 'NODE',
    destinationId: destId,
    navigation: 'OVERLAY',
    transition,
    resetScrollPosition: false,
    overlayRelativePosition: { x: 0.5, y: 0.5 },
  }
}

async function loadFontsUnder(root) {
  const texts = root.findAll((n) => n.type === 'TEXT')
  for (const t of texts) {
    const fn = t.fontName
    if (fn === figma.mixed) {
      const len = t.characters.length
      for (let i = 0; i < len; i++) {
        const r = t.getRangeFontName(i, i + 1)
        if (r !== figma.mixed) await figma.loadFontAsync(r)
      }
    } else {
      await figma.loadFontAsync(fn)
    }
  }
}

function hideTreeRowAccentsExcept(frame, selectedLabel) {
  const labels = ['contract_final.pdf', 'NDA_client_v3.docx', 'evidence_photos.zip']
  for (const lbl of labels) {
    const tn = frame.findOne((n) => n.type === 'TEXT' && n.characters === lbl && n.x < 320)
    if (!tn) continue
    const bandTop = tn.y - 16
    const bandBot = tn.y + 20
    const accents = frame.findAll(
      (n) =>
        n.type === 'RECTANGLE' &&
        n.width > 0 &&
        n.width <= 8 &&
        n.x >= 0 &&
        n.x <= 88 &&
        n.y >= bandTop &&
        n.y <= bandBot,
    )
    const on = lbl === selectedLabel
    for (const a of accents) {
      a.visible = on
    }
  }
}

function hideTableRowAccentsExcept(frame, selectedLabel) {
  const labels = ['contract_final.pdf', 'NDA_client_v3.docx', 'evidence_photos.zip']
  for (const lbl of labels) {
    const tn = frame.findOne((n) => n.type === 'TEXT' && n.characters === lbl && n.x > 280 && n.x < 920)
    if (!tn) continue
    const bandTop = tn.y - 18
    const bandBot = tn.y + 22
    const accents = frame.findAll(
      (n) =>
        n.type === 'RECTANGLE' &&
        n.width > 0 &&
        n.width <= 8 &&
        n.x >= 276 &&
        n.x <= 292 &&
        n.y >= bandTop &&
        n.y <= bandBot,
    )
    const on = lbl === selectedLabel
    for (const a of accents) {
      a.visible = on
    }
  }
}

function patchPropTexts(frame, pairs) {
  for (const [from, to] of pairs) {
    const nodes = frame.findAll((n) => n.type === 'TEXT' && n.characters === from && n.x >= 958)
    for (const n of nodes) {
      if (to !== null) n.characters = to
      else n.visible = false
    }
  }
}

async function applyPdfSelected(frame) {
  hideTreeRowAccentsExcept(frame, 'contract_final.pdf')
  hideTableRowAccentsExcept(frame, 'contract_final.pdf')
  const tOwner = frame.findOne((n) => n.type === 'TEXT' && n.characters === 'J. Mensah' && n.x >= 958)
  if (tOwner) tOwner.visible = true
}

async function applyDocxSelected(frame) {
  hideTreeRowAccentsExcept(frame, 'NDA_client_v3.docx')
  hideTableRowAccentsExcept(frame, 'NDA_client_v3.docx')
  patchPropTexts(frame, [
    ['contract_final.pdf', 'NDA_client_v3.docx'],
    ['PDF Document', 'Word Document'],
    ['2.4 MB', '841 KB'],
    ['Today, 14:22', 'Yesterday, 09:15'],
    ['PDF', 'DOCX'],
  ])
}

async function applyZipSelected(frame) {
  hideTreeRowAccentsExcept(frame, 'evidence_photos.zip')
  hideTableRowAccentsExcept(frame, 'evidence_photos.zip')
  patchPropTexts(frame, [
    ['contract_final.pdf', 'evidence_photos.zip'],
    ['PDF Document', 'ZIP Archive'],
    ['2.4 MB', '48.2 MB'],
    ['Today, 14:22', 'Jan 3, 2024'],
    ['PDF', 'ZIP'],
  ])
}

async function applyBreadcrumbLawCases(frame) {
  await applyPdfSelected(frame)
  const caseFiles = frame.findOne((n) => n.type === 'TEXT' && n.characters === 'Case Files 2024' && n.y < 52)
  const cfX = caseFiles ? caseFiles.x : 99999
  if (caseFiles) caseFiles.visible = false
  for (const c of frame.findAll((n) => n.type === 'TEXT' && n.y >= 14 && n.y <= 30 && n.x >= 260)) {
    if (c.characters === '/' && c.x >= cfX - 24) c.visible = false
  }
}

function makeHitRect(frame, name, x, y, w, h) {
  const r = figma.createRectangle()
  r.name = name
  r.resize(w, h)
  r.x = x
  r.y = y
  r.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.6, b: 1 }, opacity: 0.001 }]
  r.strokes = []
  frame.appendChild(r)
  return r
}

const explorerPage = figma.root.children.find((p) => p.name.includes('File Explorer'))
if (!explorerPage) {
  return { error: 'File Explorer page not found', pages: figma.root.children.map((p) => p.name) }
}
await figma.setCurrentPageAsync(explorerPage)

let template = explorerPage.findOne((n) => n.type === 'FRAME' && n.name === 'SecureVault – App')
if (!template) {
  template = explorerPage.findOne((n) => n.type === 'FRAME' && n.name.includes('SecureVault'))
}
if (!template) {
  return { error: 'Could not find SecureVault – App template frame on page.' }
}

let maxBottom = 0
for (const c of explorerPage.children) {
  if ('height' in c && c.visible) maxBottom = Math.max(maxBottom, c.y + c.height)
}

const protoLabels = [
  'Proto · 01 Start — PDF selected',
  'Proto · 02 DOCX selected',
  'Proto · 03 ZIP selected',
  'Proto · 04 Breadcrumb — Law Cases',
]

const gap = 96
const section = figma.createSection()
section.name = '━━ Interactive prototype (Smart Animate)'
section.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.07, b: 0.09 } }]
explorerPage.appendChild(section)
section.x = 0
section.y = maxBottom + 80
section.resizeWithoutConstraints(
  template.width * protoLabels.length + gap * (protoLabels.length + 2),
  template.height + 480,
)

const protoFrames = []
let cx = section.x + gap
for (const label of protoLabels) {
  const clone = template.clone()
  clone.name = label
  section.appendChild(clone)
  clone.x = cx
  clone.y = section.y + 72
  cx += clone.width + gap
  protoFrames.push(clone)
}

const [f1, f2, f3, f4] = protoFrames

await loadFontsUnder(f1)
await applyPdfSelected(f1)

await loadFontsUnder(f2)
await applyDocxSelected(f2)

await loadFontsUnder(f3)
await applyZipSelected(f3)

await loadFontsUnder(f4)
await applyBreadcrumbLawCases(f4)

const overlay = figma.createFrame()
overlay.name = 'Overlay · PDF preview sheet'
overlay.resize(560, 360)
overlay.cornerRadius = 12
overlay.clipsContent = true
overlay.fills = [{ type: 'SOLID', color: { r: 0.06, g: 0.08, b: 0.11 } }]
overlay.strokes = [{ type: 'SOLID', color: { r: 0.15, g: 0.18, b: 0.22 } }]
section.appendChild(overlay)
overlay.x = section.x + gap + template.width * 2 + gap * 2 + (template.width - overlay.width) / 2
overlay.y = section.y + template.height + 140

const overlayTitle = figma.createText()
await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' })
overlayTitle.characters = 'contract_final.pdf'
overlayTitle.fontSize = 16
overlayTitle.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.93, b: 0.96 } }]
overlay.appendChild(overlayTitle)
overlayTitle.x = 24
overlayTitle.y = 20

const overlayBody = figma.createText()
await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
overlayBody.characters =
  'Preview pane (wildcard UX).\n\n• Rasterised first page\n• Watermarked “CONFIDENTIAL”\n• Esc / backdrop tap closes'
overlayBody.fontSize = 13
overlayBody.lineHeight = { unit: 'PIXELS', value: 20 }
overlayBody.fills = [{ type: 'SOLID', color: { r: 0.55, g: 0.58, b: 0.62 } }]
overlay.appendChild(overlayBody)
overlayBody.x = 24
overlayBody.y = 56

const overlayClose = figma.createText()
await figma.loadFontAsync({ family: 'Inter', style: 'Medium' })
overlayClose.characters = 'Close   ✕'
overlayClose.fontSize = 13
overlayClose.fills = [{ type: 'SOLID', color: { r: 0, g: 0.9, b: 1 } }]
overlay.appendChild(overlayClose)
overlayClose.x = overlay.width - 24 - overlayClose.width
overlayClose.y = 22

function treeHitY(label, frame) {
  const tn = frame.findOne((n) => n.type === 'TEXT' && n.characters === label && n.x < 320)
  return tn ? tn.y - 14 : 240
}

const hits = []
for (const fr of protoFrames) {
  const yPdf = treeHitY('contract_final.pdf', fr)
  const yDoc = treeHitY('NDA_client_v3.docx', fr)
  const yZip = treeHitY('evidence_photos.zip', fr)
  hits.push(makeHitRect(fr, '@proto-hit/tree/pdf', 8, yPdf, 260, 30))
  hits.push(makeHitRect(fr, '@proto-hit/tree/docx', 8, yDoc, 260, 30))
  hits.push(makeHitRect(fr, '@proto-hit/tree/zip', 8, yZip, 260, 30))
}

for (const fr of protoFrames) {
  const crumbHit = makeHitRect(fr, '@proto-hit/breadcrumb/law-cases', 268, 8, 110, 36)
  hits.push(crumbHit)
  await crumbHit.setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [navTo(f4.id)] }])
}

for (const fr of protoFrames) {
  const hitPdf = fr.findOne((n) => n.name === '@proto-hit/tree/pdf')
  if (hitPdf && fr.id !== f1.id) {
    await hitPdf.setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [navTo(f1.id)] }])
  }
}

for (const fr of protoFrames) {
  const hitDoc = fr.findOne((n) => n.name === '@proto-hit/tree/docx')
  if (hitDoc && fr.id !== f2.id) {
    await hitDoc.setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [navTo(f2.id)] }])
  }
}

for (const fr of protoFrames) {
  const hitZip = fr.findOne((n) => n.name === '@proto-hit/tree/zip')
  if (hitZip && fr.id !== f3.id) {
    await hitZip.setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [navTo(f3.id)] }])
  }
}

function addOpenHit(fr) {
  const openBtnText = fr.findOne((n) => n.type === 'TEXT' && n.characters.includes('Open File'))
  if (!openBtnText) return null
  const openHit = makeHitRect(fr, '@proto-hit/open-file', openBtnText.x - 48, openBtnText.y - 10, 180, 40)
  return openHit
}

for (const fr of protoFrames) {
  const oh = addOpenHit(fr)
  if (oh) {
    hits.push(oh)
    await oh.setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [overlayTo(overlay.id)] }])
  }
}

await overlayClose.setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [{ type: 'CLOSE' }] }])

const mutatedNodeIds = protoFrames
  .map((f) => f.id)
  .concat([section.id, overlay.id, overlayTitle.id, overlayBody.id, overlayClose.id])
  .concat(hits.map((h) => h.id))
return {
  ok: true,
  sectionId: section.id,
  frames: protoFrames.map((f) => ({ id: f.id, name: f.name })),
  overlayId: overlay.id,
  mutatedNodeIds,
  note: 'Right-click "Proto · 01 …" in Figma → Set as prototype starting point, then Present (Play).',
}
