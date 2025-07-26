import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { NotesService } from '@/services/notesService';
import { Note } from '@/types';

export default function NoteScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isNewNote = id === 'new';

  useEffect(() => {
    if (isNewNote) {
      setIsLoading(false);
      setHasChanges(true);
    } else {
      loadNote();
    }
  }, [id]);

  useEffect(() => {
    if (!isLoading) {
      const titleChanged = title !== (note?.title || '');
      const contentChanged = content !== (note?.content || '');
      setHasChanges(titleChanged || contentChanged);
    }
  }, [title, content, note, isLoading]);

  const loadNote = async () => {
    try {
      const notes = await NotesService.getAllNotes();
      const foundNote = notes.find(n => n.id === id);
      if (foundNote) {
        setNote(foundNote);
        setTitle(foundNote.title);
        setContent(foundNote.content);
      } else {
        Alert.alert('Error', 'Note not found');
        router.back();
      }
    } catch (error) {
      console.error('Error loading note:', error);
      Alert.alert('Error', 'Failed to load note');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const saveNote = async () => {
    try {
      if (!title.trim() && !content.trim()) {
        Alert.alert('Error', 'Please add a title or content to save the note');
        return;
      }

      await NotesService.saveNote({
        id: isNewNote ? undefined : note?.id,
        title: title.trim() || 'Untitled',
        content: content.trim(),
      });

      setHasChanges(false);
      router.back();
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Error', 'Failed to save note');
    }
  };

  const handleBack = () => {
    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Do you want to save before leaving?',
        [
          { text: 'Discard', style: 'destructive', onPress: () => router.back() },
          { text: 'Save', onPress: saveNote },
        ]
      );
    } else {
      router.back();
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      padding: 8,
      marginRight: 8,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    saveButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.accent,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    saveButtonDisabled: {
      opacity: 0.5,
    },
    saveButtonText: {
      color: colors.background,
      fontWeight: '600',
      marginLeft: 4,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    titleInput: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 16,
      padding: 0,
    },
    contentInput: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      textAlignVertical: 'top',
      lineHeight: 24,
      padding: 0,
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isNewNote ? 'New Note' : 'Edit Note'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={saveNote}
          style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
          disabled={!hasChanges}
        >
          <Check size={16} color={colors.background} />
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          placeholder="Note title..."
          placeholderTextColor={colors.textSecondary}
          multiline
          autoFocus={isNewNote}
        />
        <TextInput
          style={styles.contentInput}
          value={content}
          onChangeText={setContent}
          placeholder="Start writing..."
          placeholderTextColor={colors.textSecondary}
          multiline
          autoFocus={!isNewNote}
        />
      </View>
    </SafeAreaView>
  );
}