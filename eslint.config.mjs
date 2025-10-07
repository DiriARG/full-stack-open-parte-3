// Archivo de configuración de ESLint.

import globals from 'globals'
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin-js'

export default [
  // Importa las reglas recomendadas de ESLint oficial.
  js.configs.recommended,
  {
    files: ['**/*.js'],
    // Configuración del entorno.
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
      ecmaVersion: 'latest',
    },
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    // Reglas estilísticas.
    rules: {
      '@stylistic/js/indent': ['error', 2], // Indentación de 2 espacios.
      '@stylistic/js/linebreak-style': ['error', 'unix'], // Fin de línea tipo Unix.
      '@stylistic/js/quotes': ['error', 'single'], // Comillas simples.
      '@stylistic/js/semi': ['error', 'never'], // Sin punto y coma.
      // Buenas prácticas.
      eqeqeq: 'error', // Evita comparaciones con "==".
      'no-trailing-spaces': 'error', // Mejora de legibilidad.
      'object-curly-spacing': ['error', 'always'], // { clave: valor } --> tenga espacios.
      'arrow-spacing': ['error', { before: true, after: true }], // Mejora de legibilidad.
      'no-console': 'off', // Para backend.
    },
  },
  { // Ignora...
    ignores: ['dist/**', 'node_modules/**'],
  },
]