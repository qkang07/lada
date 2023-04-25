import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: '@', replacement: path.join(__dirname, './src') }]
    
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        // modifyVars: {
        //   hack: `true; @import "${process.cwd()}/src/assets/style/variable.less";`,
        // },
      },
    },
    modules: {
      localsConvention: 'camelCase',
    },
  },
})
