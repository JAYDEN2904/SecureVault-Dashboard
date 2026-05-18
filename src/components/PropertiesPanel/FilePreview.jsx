import { getExtension, getFileTypeLabel, getIcon, getTypeColor } from '../../utils/fileUtils'
import './PropertiesPanel.css'

/**
 * @param {{ node: import('../../utils/treeUtils.js').VaultNode }} props
 */
export default function FilePreview({ node }) {
  const ext = getExtension(node.name)
  const typeKey = ext || 'file'
  const typeColor = getTypeColor(typeKey)
  const badge = getFileTypeLabel(node.name)

  return (
    <div className="file-preview-card" style={{ '--preview-type-color': typeColor }}>
      <div className="file-preview-card__strip" aria-hidden="true" />
      <div className="file-preview-card__body">
        <div className="file-preview-card__silhouette" aria-hidden="true">
          <span className="file-preview-card__doc-fold" />
          <span className="file-preview-card__icon">{getIcon(node)}</span>
        </div>
        <span className="file-preview-card__badge">{badge}</span>
      </div>
    </div>
  )
}
