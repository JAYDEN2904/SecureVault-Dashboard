import { formatSize, getExtension, getFileTypeLabel, getTypeColor } from '../../utils/fileUtils'
import './FileList.css'

/**
 * @param {{
 *   node: { id: string, name: string, type: string, size?: string },
 *   selectedNode: { id: string } | null,
 *   focusedId: string | null,
 *   searchQuery: string,
 *   onSelect: (node: { id: string, name: string, type: string, size?: string }) => void,
 * }} props
 */
export default function FileListRow({ node, selectedNode, focusedId, searchQuery, onSelect }) {
  const fileTypeKey = getExtension(node.name) || 'file'
  const typeLabel = getFileTypeLabel(node.name)
  const accent = getTypeColor(fileTypeKey)

  const q = searchQuery.trim().toLowerCase()
  const isMatch = Boolean(q && node.name.toLowerCase().includes(q))
  const isSelected = node.id === selectedNode?.id
  const isFocused = node.id === focusedId

  const rowClass = [
    'file-list-row',
    isSelected ? 'is-selected' : '',
    isMatch ? 'is-match' : '',
    isFocused ? 'is-focused' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <tr
      className={rowClass}
      style={{ '--file-row-accent': accent }}
      onClick={() => onSelect(node)}
    >
      <td className="file-list-row__name-cell">
        <span className="file-list-row__dot" aria-hidden="true" />
        <span className="file-list-row__name">{node.name}</span>
      </td>
      <td>
        <span className="file-list-row__badge" style={{ '--badge-accent': accent }}>
          {typeLabel}
        </span>
      </td>
      <td className="file-list-row__size">{formatSize(node.size)}</td>
      <td className="file-list-row__modified">—</td>
      <td
        className="file-list-row__actions"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <button type="button" className="file-list-row__more" aria-haspopup="true" aria-label="File actions">
          ···
        </button>
        <div className="file-list-row__menu" role="menu">
          <button type="button" className="file-list-row__menu-item" role="menuitem">
            Open
          </button>
          <button type="button" className="file-list-row__menu-item" role="menuitem">
            Download
          </button>
          <button type="button" className="file-list-row__menu-item" role="menuitem">
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}
