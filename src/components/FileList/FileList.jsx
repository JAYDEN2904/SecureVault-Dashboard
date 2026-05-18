import FileListRow from './FileListRow'
import './FileList.css'

/**
 * @param {{
 *   files: { id: string, name: string, type: string, size?: string }[],
 *   selectedNode: { id: string } | null,
 *   onSelect: (node: { id: string, name: string, type: string, size?: string }) => void,
 *   focusedId: string | null,
 *   searchQuery: string,
 * }} props
 */
export default function FileList({ files, selectedNode, onSelect, focusedId, searchQuery }) {
  const empty = files.length === 0

  return (
    <section className="file-list" aria-label="Folder files">
      {!empty ? (
        <div className="file-list__scroll">
          <table className="file-list__table">
            <colgroup>
              <col className="file-list__col-name" />
              <col className="file-list__col-type" />
              <col className="file-list__col-size" />
              <col className="file-list__col-modified" />
              <col className="file-list__col-actions" />
            </colgroup>
            <thead>
              <tr className="file-list__header-row">
                <th scope="col" className="file-list__header-cell">
                  Name
                </th>
                <th scope="col" className="file-list__header-cell">
                  Type
                </th>
                <th scope="col" className="file-list__header-cell">
                  Size
                </th>
                <th scope="col" className="file-list__header-cell">
                  Modified
                </th>
                <th scope="col" className="file-list__header-cell file-list__header-cell--actions">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {files.map((node) => (
                <FileListRow
                  key={node.id}
                  node={node}
                  selectedNode={selectedNode}
                  focusedId={focusedId}
                  searchQuery={searchQuery}
                  onSelect={onSelect}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="file-list__empty" role="status">
          <span className="file-list__empty-icon" aria-hidden="true">
            <svg className="file-list__empty-svg" viewBox="0 0 24 24" fill="none">
              <path
                fill="currentColor"
                d="M17 9h-2V7a5 5 0 00-10 0v2H5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2zm-8-2a3 3 0 016 0v2H9V7zm8 12H5v-8h12v8zm-6-3a1 1 0 112 0 1 1 0 01-2 0z"
              />
            </svg>
          </span>
          <p className="file-list__empty-title">This folder is empty</p>
          <p className="file-list__empty-sub">Files you add to this folder will appear here.</p>
        </div>
      )}
    </section>
  )
}
