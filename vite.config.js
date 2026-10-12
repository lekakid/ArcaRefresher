import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import monkey from 'vite-plugin-monkey';
import { visualizer } from 'rollup-plugin-visualizer';

import nightlyMeta from './meta.nightly.js';
import releaseMeta from './meta.release.js';
import pkg from './package.json' with { type: 'json' };

const srcDir = fileURLToPath(new URL('./src', import.meta.url));

// 주의: src 하위 이름이 npm 패키지 이름과 겹치면 src가 우선
const srcAliases = [
  ...new Set(
    fs
      .readdirSync(srcDir, { withFileTypes: true })
      .filter((e) => e.isDirectory() || /\.(jsx?|json)$/.test(e.name))
      .map((e) => (e.isDirectory() ? e.name : path.parse(e.name).name)),
  ),
].map((name) => ({
  find: new RegExp(`^${name}(?=/|$)`),
  replacement: path.join(srcDir, name),
}));

export default defineConfig(({ mode }) => {
  const isDebug = mode === 'development';
  const isAnalyze = mode === 'analyze';
  const isRelease = mode === 'production';
  const isNightly = mode === 'nightly';

  return {
    server: {
      port: 3000,
    },
    resolve: {
      alias: srcAliases,
    },
    build: {
      target: ['chrome93', 'firefox127'],
      minify: !isDebug,
      sourcemap: isDebug || isAnalyze,
      license: {
        fileName: `ArcaRefresher${isNightly ? '.nightly' : ''}.user.js.LICENSE.txt`,
      },
    },
    plugins: [
      react(),
      isDebug &&
        monkey({
          entry: 'src/index.jsx',
          userscript: releaseMeta,
          build: {
            autoGrant: true,
          },
        }),
      isNightly &&
        monkey({
          entry: 'src/index.jsx',
          userscript: {
            ...nightlyMeta,
            version: `${pkg.version}.nightly.${Date.now()}`,
          },
          build: {
            fileName: 'ArcaRefresher.nightly.user.js',
            metaFileName: 'ArcaRefresher.nightly.meta.js',
            autoGrant: true,
          },
        }),
      isRelease &&
        monkey({
          entry: 'src/index.jsx',
          userscript: releaseMeta,
          build: {
            fileName: 'ArcaRefresher.user.js',
            metaFileName: 'ArcaRefresher.meta.js',
            autoGrant: true,
          },
        }),
      isAnalyze &&
        visualizer({
          template: 'raw-data',
          filename: 'dist/bundle-report.json',
          gzipSize: true,
        }),
      isAnalyze &&
        visualizer({
          template: 'treemap',
          filename: 'dist/bundle-report.html',
          gzipSize: true,
        }),
    ].filter(Boolean),
  };
});
