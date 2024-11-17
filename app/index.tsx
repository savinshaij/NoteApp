import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system'; // For reading notes from the device

export default function Index() {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const colors = ['#B2BEB5', '#A9A9A9', '#808080', '#818589', '#D3D3D3', '#899499', '#E5E4E2', '#71797E'];

  // Function to load notes from the file system
  useEffect(() => {
    const loadNotesFromDevice = async () => {
      try {
        const directoryUri = FileSystem.documentDirectory + 'noteApp/';
        const dirInfo = await FileSystem.getInfoAsync(directoryUri);

        if (!dirInfo.exists) {
          setNotes([]);
          return;
        }

        const files = await FileSystem.readDirectoryAsync(directoryUri);
        const loadedNotes = [];

        for (const fileName of files) {
          const fileUri = directoryUri + fileName;
          const fileContent = await FileSystem.readAsStringAsync(fileUri);
          const [title, note] = fileContent.split('\n\nNote: ');

          loadedNotes.push({
            id: fileUri,
            title: title.replace('Title: ', '').trim(),
            note: note ? note.trim() : '',
          });
        }

        setNotes(loadedNotes);
      } catch (error) {
        console.error('Failed to load notes from device:', error.message);
        Alert.alert('Error', 'Failed to load notes from device.');
      }
    };

    loadNotesFromDevice();
  }, []);

  // Filter notes based on the search query
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNotePress = (note) => {
    router.push({ pathname: '/add', params: { note: JSON.stringify(note) } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Notes</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by title"
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {filteredNotes.length === 0 ? (
        <Text style={styles.emptyText}>No notes found.</Text>
      ) : (
        <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[
              styles.noteItem,
              { backgroundColor: colors[index % colors.length] }, // Assign background color based on index
            ]}
            onPress={() => handleNotePress(item)}
          >
            <Text style={styles.noteTitle}>{item.title}</Text>
            <Text style={styles.noteContent}>
              {item.note.length > 50 ? `${item.note.slice(0, 50)}...` : item.note}
            </Text>
          </TouchableOpacity>
        )}
      />
      )}

      <Link href="/add" style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E1E1DD',
    padding: 10,
    paddingTop: 30,
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    paddingVertical: 20,
    color: '#373A40',
  },
  searchInput: {
    height: 50,
    borderColor: '#373A40',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 16,
  },
  gridContainer: {
    paddingBottom: 80,
  
    paddingHorizontal:4,
    width: '100%', // Adjust width to leave equal gaps on both sides
    // alignSelf: 'center', // Ensures the container is horizontally centered
  },
  
  
  noteItem: {
    flex: 1,
    margin: 8,
    padding: 10,
   
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
    overflow: 'hidden',
    maxWidth: 150,
    maxHeight: 150,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#373A40',
    marginBottom: 5,
    textAlign: 'left',
  },
  noteContent: {
    fontSize: 14,
    color: '#555',
    textAlign: 'left',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    backgroundColor: '#373A40',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  fabText: {
    color: '#fff',
    fontSize: 38,
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
