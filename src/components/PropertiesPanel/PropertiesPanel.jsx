import { formatDate, formatSize, getExtension, getFileTypeLabel } from '../../utils/fileUtils'
import { getPath } from '../../utils/treeUtils.js'
import ActivityLog from './ActivityLog'
import FilePreview from './FilePreview'
import './PropertiesPanel.css'

/**
 * @param {{
 *   selectedNode: import('../../utils/treeUtils.js').VaultNode | null,
 *   treeData: import('../../utils/treeUtils.js').VaultNode[],
 * }} props
 */
export default function PropertiesPanel({ selectedNode, treeData }) {
  const isFile = selectedNode?.type === 'file'

  return (
    <aside className="properties-panel" aria-label="Properties">
      <div className="properties-panel__title">Properties</div>

      <div className="properties-panel__scroll">
        {!isFile ? (
          <div className="properties-panel__empty" role="status">
            <span className="properties-panel__empty-icon" aria-hidden="true">
              <svg className="properties-panel__empty-svg" viewBox="0 0 24 24" fill="none">
                <path
                  fill="currentColor"
                  d="M17 9h-2V7a5 5 0 00-10 0v2H5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2zm-8-2a3 3 0 016 0v2H9V7zm8 12H5v-8h12v8zm-6-3a1 1 0 112 0 1 1 0 01-2 0z"
                />
              </svg>
            </span>
            <p className="properties-panel__empty-title">No file selected</p>
            <p className="properties-panel__empty-sub">Click any file to inspect</p>
          </div>
        ) : (
          <>
            <section className="properties-panel__section properties-panel__section--preview">
              <FilePreview node={selectedNode} />
            </section>

            <section className="properties-panel__section properties-panel__section--meta">
              <h2 className="properties-panel__file-name">{selectedNode.name}</h2>
              <dl className="properties-panel__meta-grid">
                <div className="properties-panel__kv">
                  <dt>Type</dt>
                  <dd>{getFileTypeLabel(selectedNode.name)}</dd>
                </div>
                <div className="properties-panel__kv">
                  <dt>Size</dt>
                  <dd>{formatSize(selectedNode.size)}</dd>
                </div>
                <div className="properties-panel__kv">
                  <dt>Modified</dt>
                  <dd>{formatDate(selectedNode.modified)}</dd>
                </div>
                <div className="properties-panel__kv">
                  <dt>Created</dt>
                  <dd>{formatDate(selectedNode.created)}</dd>
                </div>
                <div className="properties-panel__kv properties-panel__kv--full">
                  <dt>Owner</dt>
                  <dd>{selectedNode.owner ?? '—'}</dd>
                </div>
              </dl>
            </section>

            <section className="properties-panel__section properties-panel__section--path">
              <h3 className="properties-panel__section-heading">Path</h3>
              <p className="properties-panel__path-text">
                {formatPathBreadcrumb(treeData, selectedNode.id)}
              </p>
            </section>

            <section className="properties-panel__section properties-panel__section--actions">
              <div className="properties-panel__actions">
                <button type="button" className="properties-panel__btn properties-panel__btn--primary">
                  ↗ Open File
                </button>
                <button type="button" className="properties-panel__btn properties-panel__btn--secondary">
                  ⬇ Download
                </button>
                <button type="button" className="properties-panel__btn properties-panel__btn--secondary">
                  🗑 Delete
                </button>
              </div>
            </section>

            <ActivityLog />

            <section className="properties-panel__section properties-panel__section--tags">
              <h3 className="properties-panel__section-heading">Tags</h3>
              <div className="properties-panel__tags">
                {(selectedNode.tags ?? []).length === 0 ? (
                  <span className="properties-panel__tags-empty">—</span>
                ) : (
                  selectedNode.tags.map((tag) => (
                    <span key={tag} className="properties-panel__tag">
                      {tag}
                    </span>
                  ))
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </aside>
  )
}

/**
 * @param {import('../../utils/treeUtils.js').VaultNode[]} treeData
 * @param {string} nodeId
 */
function formatPathBreadcrumb(treeData, nodeId) {
  const chain = getPath(treeData, nodeId)
  if (!chain.length) return '—'
  return chain.map((n) => n.name).join(' › ')
}
