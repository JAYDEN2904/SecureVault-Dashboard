import { useMemo } from 'react'
import { flattenVisible } from '../utils/treeUtils'

/**
 * @param {unknown[]} tree
 * @param {Set<string>} expandedIds
 */
export function useFileTree(tree, expandedIds) {
  return useMemo(() => flattenVisible(tree, expandedIds), [tree, expandedIds])
}
