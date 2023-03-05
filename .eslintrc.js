module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module'
    },
    plugins: [
        '@typescript-eslint/eslint-plugin',
        'simple-import-sort',
        'import'
    ],
    extends: [
        'eslint:recommended', //'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:prettier/recommended'
    ],
    root: true,
    env: {
        node: true,
        jest: true
    },
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        // 'import/order': [
        //     'error',
        //     {
        //         'newlines-between': 'always',
        //         groups: [
        //             'builtin',
        //             ['internal', 'external'],
        //             ['sibling', 'parent', 'index'],
        //         ],
        //         pathGroups: [
        //             {
        //                 pattern: '@src/**',
        //                 group: 'external',
        //                 position: 'after',
        //             },
        //         ],
        //         alphabetize: {
        //             order: 'asc',
        //             caseInsensitive: true,
        //         },
        //     },
        // ],
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/no-duplicates': 'error',
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto',
                printWidth: 140
            }
        ]
    },
    settings: {
        'import/resolver': {
            typescript: {}
        }
    }
};
