import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
    plugins: [vue()],
    base: process.env.NODE_ENV === 'production' ? '/json-editor/' : '/',
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                // api: 'modern-compiler' // Removed unsupported option
            }
        }
    },
    optimizeDeps: {
        include: [
            'd3',
            'js-yaml',
            'papaparse',
            'xml2js',
            '@ltd/j-toml',
            'jsonpath-plus',
            'ajv',
            'jsonwebtoken',
            'jq-web',
            'lodash-es',
            'html2canvas',
            'file-saver',
            'prismjs',
            'vue-prism-editor'
        ],
        exclude: ['vue', 'pinia', '@vueuse/core']
    },
    server: {
        hmr: {
            overlay: false
        }
    },
    build: {
        rollupOptions: {
            external: [],
            output: {
                manualChunks: {
                    'vendor-d3': ['d3'],
                    'vendor-utils': ['js-yaml', 'papaparse', 'xml2js', '@ltd/j-toml'],
                    'vendor-json': ['jsonpath-plus', 'ajv', 'jsonwebtoken', 'jq-web']
                }
            }
        }
    }
})
