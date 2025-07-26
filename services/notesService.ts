import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '@/types';

const NOTES_STORAGE_KEY = 'notes';

export class NotesService {
  static async getAllNotes(): Promise<Note[]> {
    try {
      const notesJson = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
      return notesJson ? JSON.parse(notesJson) : [];
    } catch (error) {
      console.error('Error loading notes:', error);
      return [];
    }
  }

  static async saveNote(note: Partial<Note>): Promise<Note> {
    try {
      const notes = await this.getAllNotes();
      const now = new Date().toISOString();

      if (note.id) {
        // Update existing note
        const index = notes.findIndex(n => n.id === note.id);
        if (index !== -1) {
          notes[index] = {
            ...notes[index],
            ...note,
            updatedAt: now,
          } as Note;
          await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
          return notes[index];
        }
      }

      // Create new note
      const newNote: Note = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        title: note.title || 'Untitled',
        content: note.content || '',
        createdAt: now,
        updatedAt: now,
      };

      notes.unshift(newNote);
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
      return newNote;
    } catch (error) {
      console.error('Error saving note:', error);
      throw error;
    }
  }

  static async deleteNote(id: string): Promise<void> {
    try {
      const notes = await this.getAllNotes();
      const filteredNotes = notes.filter(note => note.id !== id);
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(filteredNotes));
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }

  static async searchNotes(query: string): Promise<Note[]> {
    try {
      const notes = await this.getAllNotes();
      if (!query.trim()) return notes;

      const lowercaseQuery = query.toLowerCase();
      return notes.filter(note =>
        note.title.toLowerCase().includes(lowercaseQuery) ||
        note.content.toLowerCase().includes(lowercaseQuery)
      );
    } catch (error) {
      console.error('Error searching notes:', error);
      return [];
    }
  }
}