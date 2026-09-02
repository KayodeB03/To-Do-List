# To-Do List

A minimal, keyboard-friendly task manager built with vanilla JavaScript and Webpack.

[Live site](https://kayodeb03.github.io/To-Do-List/)

## Features

- **Projects** — create, rename, and delete named projects with descriptions.
- **Tasks** — add, edit, delete, and mark tasks complete inside any project.
- **Priorities** — each task has a priority (`low`, `medium`, `high`) shown by a colored edge, dot, and label.
- **Due dates** — `date-fns` handles date formatting.
- **Persistent storage** — all data is saved to `localStorage` and rehydrated on load.
- **Minimal UI** — monochrome typographic design with high-contrast focus states.
- **View Transitions** — the active project heading animates when switching projects.

## Architecture

The app uses a uni-directional data flow:

- `app.js` — single source of truth; owns the project list and active project id.
- `projects.js` — factory for creating/rehydrating project objects.
- `todo.js` — factory for creating/rehydrating todo objects.
- `storage.js` — wraps `localStorage` serialization/deserialization.
- `dom.js` — all DOM rendering and event handling.
- `index.js` — entry point; imports CSS and bootstraps the DOM module.

## Getting started

```bash
# Install dependencies
npm install

# Run the dev server
npm run dev
```

Open `http://localhost:8080` (or the port shown in the terminal).

## Build

```bash
npm run build
```

Output is written to `dist/`.

## Deploy to GitHub Pages

This repo uses the `gh-pages` branch as the Pages source.

```bash
npm run build

git add dist
git commit -m "Production build"

git subtree push --prefix dist origin gh-pages
```

If subtree ever rejects the push because `gh-pages` has diverged, force-push the split branch:

```bash
git push origin `git subtree split --prefix dist main`:gh-pages --force
```

## Tech stack

- JavaScript (ES modules)
- Webpack 5
- `html-webpack-plugin`
- `date-fns`
- Google Fonts (Archivo, Anton)
