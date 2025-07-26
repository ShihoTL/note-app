import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Note } from '@/types';

interface NoteItemProps {
  note: Note;
  onPress: () => void;
  onDelete: () => void;
}

export function NoteItem({ note, onPress, onDelete }: NoteItemProps) {
  const { colors } = useTheme();

  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString();
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      marginVertical: 4,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
      marginRight: 12,
    },
    deleteButton: {
      padding: 4,
    },
    content: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 8,
    },
    date: {
      fontSize: 12,
      color: colors.textSecondary,
    },
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {note.title}
          </Text>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Trash2 size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        {note.content.length > 0 && (
          <Text style={styles.content} numberOfLines={2}>
            {note.content}
          </Text>
        )}
        <Text style={styles.date}>
          {formatDate(note.updatedAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}