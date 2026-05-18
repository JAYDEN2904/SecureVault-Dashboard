# SecureVault Explorer

A dark-themed vault browser for nested folders: recursive tree, file list, properties panel, search with auto-expand, breadcrumbs, and keyboard navigation.

---

## Setup instructions

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open the URL Vite prints in the terminal (usually `http://localhost:5173`).

4. Production build:

   ```bash
   npm run build
   ```

---

## Design file

[Figma — SecureVault Explorer (replace with your link)](https://www.figma.com/design/4vk6Tx1wKlJVOYjhIRyJb9/SecureVault-%E2%80%93-File-Explorer-Design-System?node-id=11-2&t=KTMH07JPWkG1QitT-1)

---

## Recursive strategy

The vault is a **tree-shaped JSON** (`data.json`): each node is either a `folder` (with `children`) or a `file`. The UI does not flatten that structure ahead of time for rendering; it mirrors it with components.

**How the structure is managed:**

- **`TreeNode`** is recursive: it renders **one row** for its `node`, then maps `node.children` to nested **`TreeNode`** instances only when the folder is expanded and has children.
- **Expansion** is not stored on each node. A single **`Set<string>`** (`expandedIds`) in React state lists which folder ids are open. That keeps the data model immutable (still matches the JSON) while the view decides what to show.
- **Depth** is passed as a prop (`depth + 1` per level) so indentation scales with nesting without a fixed max depth.
- **Files** are the base case: they render a row only and never recurse.

In short: **same recursive shape as the API payload**, **controlled expansion in parent state**, **deterministic rendering for deep trees**.

---

## Wildcard feature

**Breadcrumb navigation** (navbar): when a file is selected, the trail from vault root to that file is shown as clickable segments. Choosing an ancestor folder recenters context there and **collapses descendant folders** under that pivot so reviewers don’t stay drilled into the wrong branch when switching matter context—especially useful for deep hierarchies and deadline-driven workflows.

---

## Keyboard shortcuts

| Shortcut | Context | Action |
| -------- | ------- | ------ |
| Tab | App | Move focus between controls (including the tree panel). |
| Arrow Down / Up | Tree (focused) | Previous / next visible row. |
| Arrow Right / Left | Tree (focused) | Expand / collapse folder. |
| Enter | Tree (focused) | Select focused file. |
| Escape | Tree (focused) | Clear selection and tree focus id. |
| ⌘ K / Ctrl K | Global | Focus search. |

---

## Tech stack

React 19, Vite 6, plain CSS with design tokens (`src/styles/tokens.css`). No component library.
