module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'prettier',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', 'jsx-a11y', 'import', 'prettier'],
  rules: {
    // General
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'prefer-const': 'warn',
    
    // React
    'react/prop-types': 'off', // Since we're using TypeScript
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'react/jsx-props-no-spreading': 'off',
    'react/no-unescaped-entities': 'off',
    
    // React Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // Import
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off', // TypeScript handles this
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    
    // JSX Accessibility
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
    
    // Prettier
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'es5',
        printWidth: 100,
        tabWidth: 2,
        semi: true,
        bracketSpacing: true,
        arrowParens: 'avoid',
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  overrides: [
    // Backend files
    {
      files: ['server/**/*.js'],
      env: {
        browser: false,
        node: true,
      },
      rules: {
        'no-console': 'off',
        'no-process-env': 'off',
      },
    },
    // Test files
    {
      files: ['**/*.test.js', '**/*.spec.js', '**/tests/**/*.js'],
      env: {
        jest: true,
      },
      rules: {
        'no-unused-expressions': 'off',
      },
    },
    // Configuration files
    {
      files: [
        '*.config.js',
        'config/**/*.js',
        'scripts/**/*.js',
        'webpack.config.js',
        'jest.config.js',
      ],
      env: {
        node: true,
      },
      rules: {
        'no-console': 'off',
        'global-require': 'off',
        'import/no-dynamic-require': 'off',
      },
    },
  ],
};