import { input_folders } from './utils';

const printEntryPath = (FOLDER, SERVER) => {
  const utilPort = setInterval(
    () => {
      const port = SERVER.config.server.port;
      if (port) {
        console.table(
          Object.keys(FOLDER).map(page => ({
            page: page,
            link: `http://localhost:${port}/${page}/`,
          }))
        );
        clearInterval(utilPort);
      }
  }, 1000);
}

export const consolePathsPrintPlugin = () => {
  // cppp
  return {
    name: 'vite-plugin-configure-server-console-paths-print-plugin',
    configureServer(server) {
      return () => {
        printEntryPath(input_folders, server);
      } // <end-of> configure-server callback
    } // <end-of> configure-server
  }
}