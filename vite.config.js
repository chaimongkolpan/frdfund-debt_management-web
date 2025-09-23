import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import fs from 'fs'
import * as path from 'path'
import dotenv from 'dotenv'
dotenv.config();

export default defineConfig({
    plugins: [react()],
    define: {
        global: 'globalThis',
        process: {
            env: process.env
        }
    },
    server: {
        host: '0.0.0.0',
        port: Number(process.env.PORT) || 3000,
        allowedHosts: [
            'fonts.googleapis.com',
            'debtinfo.frdfund.org'
        ],
        hmr: {
            wss: false, 
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern",
                quietDeps: true,
                silenceDeprecations: ['import'],
                includePaths: ['./src/assets']
            }
        },
    },
    resolve: {
        alias: [
            {
                find: /^~.+/,
                replacement: val => {
                    return val.replace(/^~/, '')
                }
            },
            { find: 'stream', replacement: 'stream-browserify' },
            { find: 'crypto', replacement: 'crypto-browserify' },
            { find: '@src', replacement: path.resolve(__dirname, 'src') },
            { find: '@node_modules', replacement: path.resolve(__dirname, 'node_modules') },
            { find: '@core', replacement: path.resolve(__dirname, 'src/@core') },
            { find: '@views', replacement: path.resolve(__dirname, 'src/views') },
            { find: '@store', replacement: path.resolve(__dirname, 'src/redux') },
            { find: '@configs', replacement: path.resolve(__dirname, 'src/configs') },
            { find: '@services', replacement: path.resolve(__dirname, 'src/services') },
            { find: '@styles', replacement: path.resolve(__dirname, 'src/@core/scss') },
            { find: '@utils', replacement: path.resolve(__dirname, 'src/utility/Utils') },
            { find: '@hooks', replacement: path.resolve(__dirname, 'src/utility/hooks') },
            { find: '@assets', replacement: path.resolve(__dirname, 'src/assets') },
            { find: '@layouts', replacement: path.resolve(__dirname, 'src/@core/layouts') },
            { find: '@components', replacement: path.resolve(__dirname, 'src/@core/components') },
            { find: 'url', replacement: 'rollup-plugin-node-polyfills/polyfills/url' },
            { find: 'util', replacement: 'rollup-plugin-node-polyfills/polyfills/util' },
            { find: 'zlib', replacement: 'rollup-plugin-node-polyfills/polyfills/zlib' },
            { find: 'assert', replacement: 'rollup-plugin-node-polyfills/polyfills/assert' },
            { find: 'buffer', replacement: 'rollup-plugin-node-polyfills/polyfills/buffer-es6' },
            { find: 'process', replacement: 'rollup-plugin-node-polyfills/polyfills/process-es6' },
        ]
    },
    esbuild: {
        loader: 'jsx',
        include: /.\/src\/.*\.js?$/,
        exclude: [],
        jsx: 'automatic'
    },
    optimizeDeps: {
        esbuildOptions: {
            loader: {
                '.js': 'jsx'
            },
            plugins: [
                NodeGlobalsPolyfillPlugin({
                  buffer: true,
                  process: true
                }),
                {
                    name: 'load-js-files-as-jsx',
                    setup(build) {
                        build.onLoad({ filter: /src\\.*\.js$/ }, async args => ({
                            loader: 'jsx',
                            contents: await fs.readFileSync(args.path, 'utf8')
                        }))
                    }
                }
            ]
        }
    },
    build: {
        minify: false,
        rollupOptions: {
            external: [/^node:.*/,],
            plugins: [rollupNodePolyFill()]
        }
    }
})
