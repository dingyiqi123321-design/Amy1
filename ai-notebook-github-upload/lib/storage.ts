import { Note } from '@/types/note';

const NOTES_KEY = 'ai-notebook-notes';
const API_KEY = 'ai-notebook-api-key';

export function loadNotesFromLocalStorage(): Note[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const notesJson = localStorage.getItem(NOTES_KEY);
    if (!notesJson) return [];
    
    const notes = JSON.parse(notesJson);
    return Array.isArray(notes) ? notes : [];
  } catch (error) {
    console.error('加载笔记失败:', error);
    return [];
  }
}

export function saveNotesToLocalStorage(notes: Note[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('保存笔记失败:', error);
  }
}

export function getApiKey(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(API_KEY);
  } catch (error) {
    console.error('获取API密钥失败:', error);
    return null;
  }
}

export function saveApiKey(apiKey: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(API_KEY, apiKey);
  } catch (error) {
    console.error('保存API密钥失败:', error);
  }
}

export function removeApiKey(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(API_KEY);
  } catch (error) {
    console.error('删除API密钥失败:', error);
  }
}