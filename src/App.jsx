import { useCallback, useMemo, useState } from 'react'
import vaultTree from '../data.json'
import './App.css'
import FileExplorer, {
  buildExplorerRootTree,
  EXPLORER_ROOT_ID,
} from './components/FileExplorer/FileExplorer.jsx'
import FileList from './components/FileList/FileList.jsx'
import NavBar from './components/NavBar/NavBar.jsx'
import PropertiesPanel from './components/PropertiesPanel/PropertiesPanel.jsx'
import SearchBar from './components/SearchBar/SearchBar.jsx'
import StatusBar from './components/StatusBar/StatusBar.jsx'
import { useFileTree } from './hooks/useFileTree.js'
import { useSearch } from './hooks/useSearch.js'
import {
  collectDescendantFolderIds,
  findNodeById,
  getTopLevelFolderIds,
} from './utils/treeUtils.js'

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

  const { filteredNodes, autoExpandedIds } = useSearch(tree, searchQuery)

  const effectiveExpanded = useMemo(() => {
    const next = new Set(expandedIds)
    autoExpandedIds.forEach((id) => next.add(id))
    return next
  }, [expandedIds, autoExpandedIds])

  const explorerRoots = useMemo(() => [buildExplorerRootTree(tree)], [tree])
  const visibleRows = useFileTree(explorerRoots, effectiveExpanded)

  const searchActive = Boolean(searchQuery.trim())

  const listFiles = useMemo(() => {
    const kids = activeFolder?.children ?? []
    return kids.filter((n) => n.type === 'file')
  }, [activeFolder])

  const fileListFiles = useMemo(() => {
    if (!searchActive) return listFiles
    return filteredNodes.filter((n) => n.type === 'file')
  }, [searchActive, filteredNodes, listFiles])

  const handleBreadcrumbNavigate = useCallback(
    (folderId) => {
      const folder = findNodeById(tree, folderId)
      if (!folder || folder.type !== 'folder') return

      setSelectedNode(null)
      setActiveFolder(folder)
      setFocusedId(folderId)

      const descendantFolderIds = collectDescendantFolderIds(folder)
      setExpandedIds((prev) => {
        const next = new Set(prev)
        descendantFolderIds.forEach((id) => next.delete(id))
        return next
      })
    },
    [tree],
  )

  return (
    <div className="sv-shell">
      <NavBar
        treeData={tree}
        selectedNode={selectedNode}
        expandedIds={expandedIds}
        onNavigate={handleBreadcrumbNavigate}
      />

      <div className="sv-toolbar">
        <SearchBar
          query={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
      </div>

      <div className="sv-main">
        <div className="sv-column">
          <FileExplorer
            treeData={tree}
            expandedIds={effectiveExpanded}
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
            files={fileListFiles}
            selectedNode={selectedNode}
            onSelect={(node) => {
              setSelectedNode(node)
              setFocusedId(node.id)
            }}
            focusedId={focusedId}
            searchQuery={searchQuery}
          />
        </div>

        <div className="sv-column">
          <PropertiesPanel selectedNode={selectedNode} treeData={tree} />
        </div>
      </div>

      <StatusBar visibleCount={visibleRows.length} query={searchQuery} />
    </div>
  )
}
