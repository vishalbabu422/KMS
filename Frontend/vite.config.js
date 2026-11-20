import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import autoprefixer from 'autoprefixer'
import prefixSelectors from 'postcss-prefix-selector'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

const replaceRootSelector = (prefix, selector, prefixedSelector, themeAttribute) => {
  for (const rootSelector of [':root', 'html', 'body']) {
    const rootSuffix = selector.slice(rootSelector.length)
    const isRootSelector =
      selector === rootSelector ||
      (selector.startsWith(rootSelector) && /^[\s.#:[>+~]/.test(rootSuffix))

    if (isRootSelector) {
      return `${prefix}${rootSuffix}`
    }
  }

  if (themeAttribute && selector.startsWith(themeAttribute)) {
    return `${prefix}${selector}`
  }

  return prefixedSelector
}

const replaceUserRootSelector = (prefix, selector, prefixedSelector) => {
  const rootSelector = replaceRootSelector(prefix, selector, prefixedSelector, '[data-bs-theme')

  if (rootSelector !== prefixedSelector) {
    return rootSelector
  }

  const collapsedStateClass = '.left-side-collapsed'
  const collapsedStateSuffix = selector.slice(collapsedStateClass.length)
  const isCollapsedStateRoot =
    selector === collapsedStateClass ||
    (selector.startsWith(collapsedStateClass) && /^[\s.#:[>+~]/.test(collapsedStateSuffix))

  if (isCollapsedStateRoot) {
    return `${prefix}${selector}`
  }

  if (
    selector === '.body' ||
    selector.startsWith('.body.') ||
    selector.startsWith('.body:') ||
    selector.startsWith('.body ')
  ) {
    return `${prefix}${selector}`
  }

  if (selector === '#text-spacing' || selector.startsWith('#text-spacing')) {
    return `${prefix}${selector}`
  }

  return prefixedSelector
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(projectRoot, 'src'),
      },
      {
        find: /^src\//,
        replacement: `${path.resolve(projectRoot, 'src/modules/admin')}/`,
      },
    ],
  },
  css: {
    postcss: {
      plugins: [
        prefixSelectors({
          prefix: '.admin-module',
          includeFiles: [
            /[\\/]src[\\/]modules[\\/]admin[\\/]scss[\\/]/,
            /[\\/]node_modules[\\/]simplebar-react[\\/]dist[\\/]simplebar\.min\.css$/,
          ],
          transform: (prefix, selector, prefixedSelector) =>
            replaceRootSelector(prefix, selector, prefixedSelector, '[data-coreui-theme'),
        }),
        prefixSelectors({
          prefix: '.user-module',
          includeFiles: [
            /[\\/]src[\\/]modules[\\/]user[\\/]styles[\\/]user\.css(?:\?.*)?$/,
          ],
          transform: replaceUserRootSelector,
        }),
        autoprefixer(),
      ],
    },
  },
})
