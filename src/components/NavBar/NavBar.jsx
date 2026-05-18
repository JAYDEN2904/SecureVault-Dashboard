import Breadcrumb from '../Breadcrumb/Breadcrumb.jsx'
import './NavBar.css'

/**
 * @param {{
 *   treeData: import('../../utils/treeUtils.js').VaultNode[],
 *   selectedNode: import('../../utils/treeUtils.js').VaultNode | null,
 *   expandedIds: Set<string>,
 *   onNavigate: (folderId: string) => void,
 * }} props
 */
export default function NavBar({ treeData, selectedNode, expandedIds, onNavigate }) {
  return (
    <header className="nav-bar" role="banner">
      <div className="nav-bar__brand">
        <span className="nav-bar__logo" aria-hidden="true" />
        <span className="nav-bar__title">SecureVault</span>
        <span className="nav-bar__subtitle">Explorer</span>
      </div>

      <div className="nav-bar__breadcrumb">
        <Breadcrumb
          treeData={treeData}
          selectedNode={selectedNode}
          expandedIds={expandedIds}
          onNavigate={onNavigate}
        />
      </div>

      <div className="nav-bar__avatar" aria-hidden="true" title="Account (placeholder)" />
    </header>
  )
}
