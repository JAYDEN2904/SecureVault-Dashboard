import { useMemo, useState } from 'react'
import vaultTree from '../data.json'
import './App.css'
import FileExplorer, {
  buildExplorerRootTree,
  EXPLORER_ROOT_ID,
} from './components/FileExplorer/FileExplorer.jsx'
import FileList from './components/FileList/FileList.jsx'
import StatusBar from './components/StatusBar/StatusBar.jsx'
import { useFileTree } from './hooks/useFileTree.js'
import { getTopLevelFolderIds } from './utils/treeUtils.js'

export default function App() {
  const tree = vaultTree
  const firstFolder = tree.find((n) => n.type === 'folder') ?? null

  const [expandedIds, setExpandedIds] = useState(
    () => new Set([EXPLORER_ROOT_ID, ...getTopLevelFolderIds(tree)]),
  )
  const [selectedNode, setSelectedNode] = useState(null)
  const [focusedId, setFocusedId] = useState(firstFolder?.id ?? null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFolder, setActiveFolder] = useState(firstFolder)

  const explorerRoots = useMemo(() => [buildExplorerRootTree(tree)], [tree])
  const visibleRows = useFileTree(explorerRoots, expandedIds)

  const listFiles = useMemo(() => {
    const kids = activeFolder?.children ?? []
    return kids.filter((n) => n.type === 'file')
  }, [activeFolder])

  return (
    <div className="sv-shell">
      <div className="sv-toolbar" />

      <div className="sv-main">
        <div className="sv-column">
          <FileExplorer
            treeData={tree}
            expandedIds={expandedIds}
            setExpandedIds={setExpandedIds}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            focusedId={focusedId}
            setFocusedId={setFocusedId}
            searchQuery={searchQuery}
            activeFolder={activeFolder}
            setActiveFolder={setActiveFolder}
          />
        </div>

        <div className="sv-column">
          <FileList
            files={listFiles}
            selectedNode={selectedNode}
            onSelect={(node) => {
              setSelectedNode(node)
              setFocusedId(node.id)
            }}
            focusedId={focusedId}
            searchQuery={searchQuery}
          />
        </div>

        <div className="sv-column" />
      </div>

      <StatusBar visibleCount={visibleRows.length} query="" />
    </div>
  )
}
