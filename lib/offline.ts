import type { FragmentSchema } from './schema'

export function generateOfflineFragment(prompt: string): FragmentSchema {
  const p = prompt.toLowerCase()

  if (p.includes('next') || p.includes('next.js')) {
    return {
      commentary:
        'Generated a minimal Next.js app (offline preset). Use Run in browser to start it.',
      template: 'nextjs-developer',
      title: 'Next.js App',
      description: 'Minimal Next.js starter with an API route.',
      additional_dependencies: ['next', 'react', 'react-dom'],
      has_additional_dependencies: false,
      install_dependencies_command: 'npm install',
      port: 3000,
      file_path: 'package.json',
      code: [
        {
          file_name: 'package.json',
          file_path: 'package.json',
          file_content: JSON.stringify(
            {
              name: 'offline-next-app',
              private: true,
              scripts: {
                dev: 'next dev',
                build: 'next build',
                start: 'next start',
              },
              dependencies: {
                next: '14.2.3',
                react: '18.2.0',
                'react-dom': '18.2.0',
              },
            },
            null,
            2,
          ),
          file_finished: true,
        },
        {
          file_name: 'next.config.mjs',
          file_path: 'next.config.mjs',
          file_content: 'export default { }',
          file_finished: true,
        },
        {
          file_name: '_app.tsx',
          file_path: 'pages/_app.tsx',
          file_content:
            "import type { AppProps } from 'next/app'\nimport '@/styles/globals.css'\nexport default function App({ Component, pageProps }: AppProps){ return <Component {...pageProps} /> }",
          file_finished: true,
        },
        {
          file_name: 'index.tsx',
          file_path: 'pages/index.tsx',
          file_content:
            "export default function Home(){ return <main style={{padding:20}}><h1>Offline Next.js Starter</h1><p>API: <a href=\"/api/hello\">/api/hello</a></p></main> }",
          file_finished: true,
        },
        {
          file_name: 'hello.ts',
          file_path: 'pages/api/hello.ts',
          file_content:
            "import type { NextApiRequest, NextApiResponse } from 'next'\nexport default function handler(_req: NextApiRequest, res: NextApiResponse){ res.status(200).json({ ok: true, message: 'Hello from offline API' }) }",
          file_finished: true,
        },
        {
          file_name: 'globals.css',
          file_path: 'styles/globals.css',
          file_content: 'body{font-family: system-ui, sans-serif}',
          file_finished: true,
        },
      ],
    } as unknown as FragmentSchema
  }

  if (p.includes('streamlit')) {
    return {
      commentary: 'Generated a Streamlit demo (offline preset).',
      template: 'streamlit-developer',
      title: 'Streamlit App',
      description: 'Simple Streamlit app.',
      additional_dependencies: ['streamlit'],
      has_additional_dependencies: true,
      install_dependencies_command: 'pip install streamlit',
      port: 8501,
      file_path: 'app.py',
      code: 'import streamlit as st\nst.title("Offline Streamlit Demo")\nst.write("Hello!")',
    } as unknown as FragmentSchema
  }

  if (p.includes('gradio')) {
    return {
      commentary: 'Generated a Gradio demo (offline preset).',
      template: 'gradio-developer',
      title: 'Gradio App',
      description: 'Simple Gradio interface.',
      additional_dependencies: ['gradio'],
      has_additional_dependencies: true,
      install_dependencies_command: 'pip install gradio',
      port: 7860,
      file_path: 'app.py',
      code: 'import gradio as gr\n\niface = gr.Interface(fn=lambda x: x, inputs="text", outputs="text", title="Offline Gradio")\niface.launch()',
    } as unknown as FragmentSchema
  }

  if (p.includes('vue')) {
    return {
      commentary: 'Generated a minimal Vue starter (offline preset).',
      template: 'vue-developer',
      title: 'Vue App',
      description: 'Minimal Vue 3 starter.',
      additional_dependencies: ['vue'],
      has_additional_dependencies: false,
      install_dependencies_command: 'npm install',
      port: 3000,
      file_path: 'app.vue',
      code: '<template><main><h1>Offline Vue Starter</h1></main></template>',
    } as unknown as FragmentSchema
  }

  // Default: Python
  return {
    commentary: 'Generated a Python demo (offline preset).',
    template: 'code-interpreter-v1',
    title: 'Python Demo',
    description: 'Simple Python snippet.',
    additional_dependencies: [],
    has_additional_dependencies: false,
    install_dependencies_command: 'pip install --no-deps',
    port: null,
    file_path: 'script.py',
    code: 'print("Hello from offline mode")',
  } as unknown as FragmentSchema
}