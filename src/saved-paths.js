export const PATHS_KEY = 'revista-campus:prototype:paths:v1';
const VALID_IDS = ['estudo', 'criatividade', 'bem-estar'];

export function readPaths(storage) {
  try {
    const value = JSON.parse(storage.getItem(PATHS_KEY) || '[]');
    return Array.isArray(value) ? [...new Set(value.filter(id => VALID_IDS.includes(id)))] : [];
  } catch {
    return [];
  }
}

export function writePaths(storage, paths) {
  try {
    storage.setItem(PATHS_KEY, JSON.stringify(paths));
    return true;
  } catch {
    return false;
  }
}

export function togglePath(paths, id) {
  if (!VALID_IDS.includes(id)) return paths;
  return paths.includes(id) ? paths.filter(item => item !== id) : [...paths, id];
}
