import React, { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  SafeAreaView, 
  Keyboard, 
  TouchableWithoutFeedback 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';

export default function AddScreen() {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const router = useRouter();
  const { note: noteParam, id } = useLocalSearchParams();

  // Load note for editing if provided
  useEffect(() => {
    if (noteParam) {
      try {
        const parsedNote = JSON.parse(decodeURIComponent(noteParam));
        setTitle(parsedNote.title || '');
        setNote(parsedNote.note || '');
      } catch (error) {
        console.error('Failed to parse note:', error);
      }
    }
  }, [noteParam]);

  // Save the note to the device
  const saveNoteToDevice = async () => {
    if (title.trim() === '' || note.trim() === '') {
      Alert.alert('Validation Error', 'Both Title and Note are required.');
      return;
    }

    const noteContent = `Title: ${title}\n\nNote: ${note}`;
    const directoryUri = FileSystem.documentDirectory + 'noteApp/';

    try {
      const dirInfo = await FileSystem.getInfoAsync(directoryUri);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(directoryUri, { intermediates: true });
      }

      const fileUri = directoryUri + title + '.txt';
      await FileSystem.writeAsStringAsync(fileUri, noteContent);
      Alert.alert('Success', 'Note saved to device!');
      router.push('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to save the note to device.');
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#E1E1DD' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <Text style={styles.heading}>{id ? 'Edit Note' : 'Add Note'}</Text>
              <TouchableOpacity style={styles.deviceButton} onPress={saveNoteToDevice}>
                <Ionicons name="save" size={24} color="#373A40" />
              </TouchableOpacity>
            </View>

            {/* Title Input */}
            <TextInput
              style={styles.titleInput}
              placeholder="Enter Title"
              placeholderTextColor="#888"
              value={title}
              onChangeText={setTitle}
            />

            {/* Note Input */}
            <TextInput
              style={styles.noteInput}
              placeholder="Enter Note"
              placeholderTextColor="#888"
              value={note}
              onChangeText={setNote}
              multiline
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E1E1DD',
    padding: 10,
    paddingTop: 50,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#373A40',
  },
  titleInput: {
    height: 50,
    borderColor: '#373A40',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 19,
    backgroundColor: '#fff',
    marginBottom: 10,
    fontWeight:'bold',
  },
  noteInput: {
    flex: 1, // Allows the note input to stretch to fill the remaining space
    textAlignVertical: 'top',
    borderColor: '#373A40',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  deviceButton: {
    padding: 10,
    borderRadius: 8,
    borderColor: '#373A40',
    borderWidth: 2,
    backgroundColor: '#E1E1DD',
  },
});
