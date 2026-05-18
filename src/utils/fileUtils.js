/** @param {string} name */
export function getExtension(name) {
  const i = name.lastIndexOf('.')
  if (i <= 0 || i === name.length - 1) return ''
  return name.slice(i + 1).toLowerCase()
}

/**
 * Token color for a file type. Pass a lowercase extension (no dot), an uppercase
 * badge label ("PDF"), or a filename — filenames use their extension.
 * @param {string} fileType
 */
export function getTypeColor(fileType) {
  const raw = String(fileType).trim()
  const ext = raw.includes('.') ? getExtension(raw) : raw.toLowerCase().replace(/^\./, '')
  if (ext === 'pdf') return 'var(--type-pdf)'
  if (['doc', 'docx', 'txt', 'md', 'yaml', 'yml', 'json'].includes(ext)) return 'var(--type-docx)'
  if (['xlsx', 'xls', 'csv'].includes(ext)) return 'var(--type-docx)'
  if (['zip', 'rar', '7z'].includes(ext)) return 'var(--type-zip)'
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) return 'var(--type-img)'
  return 'var(--type-default)'
}

/** @param {string} fileName */
export function getFileTypeLabel(fileName) {
  const ext = getExtension(fileName)
  return ext ? ext.toUpperCase() : 'FILE'
}

/** @param {string | undefined} size */
export function formatSize(size) {
  return size ?? '—'
}

/**
 * @param {string | number | undefined | null} value ISO date string, timestamp, or undefined
 */
export function formatDate(value) {
  if (value == null || value === '') return '—'
  const d = typeof value === 'number' ? new Date(value) : new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(d)
}

/**
 * @param {{ type: string, name: string }} node
 * @returns {string}
 */
export function getIcon(node) {
  if (node.type === 'folder') return 'DIR'
  const ext = getExtension(node.name)
  if (ext === 'pdf') return 'PDF'
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return 'IMG'
  if (['zip', 'rar'].includes(ext)) return 'ZIP'
  return ext ? ext.toUpperCase().slice(0, 3) : 'FILE'
}
