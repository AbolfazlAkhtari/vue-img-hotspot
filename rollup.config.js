import vue from 'rollup-plugin-vue2'
import postcss from 'rollup-plugin-postcss'

export default [
    {
        input: 'src/index.js',
        output: {
            format: 'esm',
            dir: 'dist'
        },
        plugins: [
            vue({css: false}), postcss()
        ]
    }
]