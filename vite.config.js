import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [react()],

  proxy: {
    '/': 'https://devflix-awrx.onrender.com',
    }
  
});

// http://localhost:8080

// https://devflix-awrx.onrender.com