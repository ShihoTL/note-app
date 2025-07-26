import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FileText, Plus } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { NotesService } from '@/services/notesService';
import { NoteItem } from '@/components/NoteItem';
import { SearchBar } from '@/components/SearchBar';
import { Note } from '@/types';
import ScreenWrapper from '@/components/ScreenWrapper';

export default function NotesScreen() {
  const { colors } = useTheme();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    filterNotes();
  }, [notes, searchQuery]);

  const loadNotes = async () => {
    try {
      const loadedNotes = await NotesService.getAllNotes();
      setNotes(loadedNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterNotes = async () => {
    if (searchQuery.trim()) {
      const searchResults = await NotesService.searchNotes(searchQuery);
      setFilteredNotes(searchResults);
    } else {
      setFilteredNotes(notes);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadNotes();
    setRefreshing(false);
  }, []);

  const handleNotePress = (note: Note) => {
    router.push({
      pathname: '/note/[id]',
      params: { id: note.id },
    });
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await NotesService.deleteNote(noteId);
      await loadNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleCreateNote = () => {
    router.push('/note/new');
  };

  const renderNote = ({ item }: { item: Note }) => (
    <NoteItem
      note={item}
      onPress={() => handleNotePress(item)}
      onDelete={() => handleDeleteNote(item.id)}
    />
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
    },
    title: {
      fontSize: 25,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 16,
    },
    fabContainer: {
      position: 'absolute',
      bottom: 24,
      right: 24,
    },
    fab: {
      backgroundColor: colors.accent,
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
  });

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notes</Text>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search notes..."
        />
      </View>

      <FlatList
        data={filteredNotes}
        renderItem={renderNote}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          filteredNotes.length === 0 ? { flex: 1 } : { paddingBottom: 100 }
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.textSecondary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FileText size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'No notes found matching your search'
                : 'No notes yet. Create your first note!'}
            </Text>
          </View>
        }
      />

      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={handleCreateNote}
          activeOpacity={0.8}
        >
          <Plus size={24} color={colors.background} />
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}
