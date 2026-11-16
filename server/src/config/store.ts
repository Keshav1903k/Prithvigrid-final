import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

export interface StoreData {
  users: any[];
  inquiries: any[];
  projects: any[];
  blogs: any[];
  services: any[];
  testimonials: any[];
}

const defaultData: StoreData = {
  users: [],
  inquiries: [],
  projects: [],
  blogs: [],
  services: [],
  testimonials: [],
};

let memoryStore: StoreData = { ...defaultData };

export async function initializeFileStore(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      const content = await fs.readFile(STORE_FILE, 'utf-8');
      memoryStore = JSON.parse(content);
    } catch {
      // File doesn't exist yet, write defaults
      await fs.writeFile(STORE_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
      memoryStore = { ...defaultData };
    }
  } catch (err) {
    console.error('[FileStore] Initialization error:', err);
  }
}

export async function persistStore(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(STORE_FILE, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('[FileStore] Persist error:', err);
  }
}

export const getStore = (): StoreData => memoryStore;

