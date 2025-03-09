export function getFileNameWithOutExtension(path: string): string {
    // get file name without extension
    // Example: If path is 'path/to/file.txt', returns 'file'
    return path.match(/([^\/\\]+)(?=\.\w+$)/)?.[1] ?? '';
  }