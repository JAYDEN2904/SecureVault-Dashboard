import { memo } from 'react'
import './TreeNode.css'

/*
RECURSIVE STRATEGY: Each TreeNode renders exactly one UI row for its node argument, so the visible tree is the transitive closure of nested TreeNode calls along expanded branches. Folder nodes recurse only when they appear in expandedIds and have children: each child receives depth + 1 so horizontal indentation scales linearly with nesting depth without hardcoding a maximum. Files are the base case and never recurse. Expansion state is fully controlled by the parent via expandedIds (a Set of folder ids), which keeps rendering deterministic for arbitrarily deep trees such as the nested folders in data.json.
*/

/**
 * @param {{
 *   node: { id: string, name: string, type: string, children?: unknown[] },
 *   depth: number,
 *   expandedIds: Set<string>,
 *   selectedId: string | null,
 *   focusedId: string | null,
 *   onToggle: (id: string) => void,
 *   onSelect: (node: { id: string, name: string, type: string }) => void,
 *   onFocus: (id: string) => void,
 * }} props
 */
function TreeNode({
  node,
  depth,
  expandedIds,
  selectedId,
  focusedId,
  onToggle,
  onSelect,
  onFocus,
}) {
  const isFolder = node.type === 'folder'
  const expanded = isFolder && expandedIds.has(node.id)
  const selected = selectedId === node.id
  const focused = focusedId === node.id

  const rowClass = [
    'tree-node-row',
    isFolder ? 'is-folder' : 'is-file',
    selected ? 'is-selected' : '',
    focused ? 'is-focused' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const handleClick = (e) => {
    e.stopPropagation()
    onFocus(node.id)
    if (isFolder) {
      onToggle(node.id)
    } else {
      onSelect(node)
    }
  }

  return (
    <>
      <div
        role="treeitem"
        aria-expanded={isFolder ? expanded : undefined}
        aria-selected={isFolder ? undefined : selected}
        className={rowClass}
        style={{ paddingLeft: `${depth * 16}px` }}
        data-node-id={node.id}
        data-depth={depth}
        onClick={handleClick}
      >
        <span
          className={[
            'tree-node-row__chevron',
            isFolder ? '' : 'tree-node-row__chevron--placeholder',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-hidden="true"
        >
          {isFolder ? (expanded ? '▾' : '▸') : null}
        </span>
        <span className="tree-node-row__name">{node.name}</span>
      </div>

      {isFolder && expanded && node.children?.length ? (
        <div role="group">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedIds={expandedIds}
              selectedId={selectedId}
              focusedId={focusedId}
              onToggle={onToggle}
              onSelect={onSelect}
              onFocus={onFocus}
            />
          ))}
        </div>
      ) : null}
    </>
  )
}

export default memo(TreeNode)
