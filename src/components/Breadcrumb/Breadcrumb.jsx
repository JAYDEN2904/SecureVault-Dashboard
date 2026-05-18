/*
WILDCARD FEATURE: Breadcrumbs give attorneys immediate spatial awareness inside sprawling matter hierarchies so they stop wasting billable minutes locating the folder context behind an exhibit or filing. Jumping to an ancestor with one click collapses deeper subtrees under that pivot, which trims accidental drill-ins when reviewers switch matters under deadline pressure.
*/

import { getPath } from '../../utils/treeUtils.js'
import './Breadcrumb.css'

const ROOT_LABEL = 'Vault'

/**
 * @param {{
 *   treeData: import('../../utils/treeUtils.js').VaultNode[],
 *   selectedNode: import('../../utils/treeUtils.js').VaultNode | null,
 *   expandedIds: Set<string>,
 *   onNavigate: (folderId: string) => void,
 * }} props
 */
export default function Breadcrumb({ treeData, selectedNode, expandedIds: _expandedIds, onNavigate }) {
  void _expandedIds

  const renderRootOnly = () => (
    <nav className="breadcrumb" aria-label="Vault path">
      <ol className="breadcrumb__list">
        <li className="breadcrumb__item">
          <span className="breadcrumb__current">{ROOT_LABEL}</span>
        </li>
      </ol>
    </nav>
  )

  if (!selectedNode) {
    return renderRootOnly()
  }

  const segments = getPath(treeData, selectedNode.id)
  if (!segments.length) {
    return renderRootOnly()
  }

  return (
    <nav className="breadcrumb" aria-label="Vault path">
      <ol className="breadcrumb__list">
        {segments.map((seg, i) => {
          const isLast = i === segments.length - 1
          const showSep = i > 0

          return (
            <li key={`${seg.id}-${i}`} className="breadcrumb__item">
              {showSep ? (
                <span className="breadcrumb__sep" aria-hidden="true">
                  ›
                </span>
              ) : null}
              {isLast ? (
                <span className="breadcrumb__current">{seg.name}</span>
              ) : seg.type === 'folder' ? (
                <button type="button" className="breadcrumb__btn" onClick={() => onNavigate(seg.id)}>
                  {seg.name}
                </button>
              ) : (
                <span className="breadcrumb__text">{seg.name}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
