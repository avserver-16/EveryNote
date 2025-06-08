import { TextInput, View, Text, TouchableOpacity, StyleSheet, Pressable, Modal, Alert, ImageBackground, Image } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth, useUser } from '@clerk/clerk-expo';
import React, { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';


export default function Home({ navigation }) {





  const { signOut } = useAuth();
  const handleSignOut = async () => {
    try {
      await signOut();
      navigation.replace('Login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  const [modalVisible, setModalVisible] = useState(false);

  const buttons = ['Get started', 'Meeting', 'To-Do', '+Create Category']
  const { user } = useUser();
  user.username
  console.log(user.emailAddresses[0]?.emailAddress, user.firstName, user.imageUrl);

const [email,setEmail]=useState('');
const [getemail,setGetmail]=useState([]);
const [thoughts,setThoughts]=useState('');
const [getthoughts,setGetthoughts]=useState([]);

useEffect(()=>{
  if(user){
  setEmail(user.emailAddresses[0]?.emailAddress);}
  
})

const database = async () => {
  const db = await SQLite.openDatabaseAsync('everynote.db');
  console.log("Database Triggered");
  console.log("Email:", email);
  console.log("Thoughts:", thoughts);

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY NOT NULL, 
      thoughts TEXT NOT NULL
    );
  `);

  await db.runAsync(
    `INSERT INTO users (email, thoughts) 
     VALUES (?, ?) 
     ON CONFLICT(email) 
     DO UPDATE SET thoughts=excluded.thoughts;`,
    [email, thoughts]
  );

  console.log("Fetching users data...");
  const allRows = await db.getAllAsync('SELECT * FROM users');

  // Collect arrays
  const emails = [];
  const thoughtsList = [];
  allRows.forEach(row => {
    emails.push(row.email);
    thoughtsList.push(row.thoughts);
    console.log(row.email, row.thoughts);
  });

  // Set state once
  setGetmail(emails);
  setGetthoughts(thoughtsList);

  console.log("Updated state:", emails, thoughtsList);
};


  return (<View style={styles.container}>
    <TextInput style={{ color: 'white', backgroundColor: '#212121', top: 70, width: '37%', height: 50, borderRadius: 25, paddingLeft: 40, fontFamily: 'Nlight', fontSize: 20 }} placeholder="Search" placeholderTextColor={'#888'}>
    </TextInput>
    <Icon name="search" size={20} color="#888" style={{ top: 35, left: 10 }} />
    <View
      style={{
        position: 'absolute',
        top: 85,
        left: 155,
        backgroundColor: '#212121',
        width: 50,
        height: 50,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name="calendar" size={24} color="#888" />
    </View>
    <TouchableOpacity onPress={() => { setModalVisible(true) }}><View
      style={{
        position: 'absolute',
        top: 0,
        left: 195,
        backgroundColor: '#212121',
        width: 50,
        height: 50,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name="water" size={24} color="#888" />
    </View></TouchableOpacity>
    <View
      style={{
        backgroundColor: 'black',
        height: 50,
        top: 80,
        padding: 0,
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {buttons.map((button, index) => (
        <TouchableOpacity key={index}>
          <View
            style={{
              backgroundColor: 'black',
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 25,
              borderWidth: 1,
              borderColor: '#212121',
              height: 40,
              padding: 5,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text style={{ fontFamily: 'Nlight', fontSize: 13, color: '#888' }}>{button}</Text>
          </View></TouchableOpacity>
      ))}
    </View>
    <Text style={{ color: 'white', fontSize: 25, top: 100, left: 10, fontFamily: 'Nitalic' }}>1 Jun,2025</Text>
    <TextInput
      style={{
        backgroundColor: 'black',
        top: 120,
        padding: 10,
        height: 500,
        borderRadius: 10,
        color: 'white',
        textAlignVertical: 'top',
        fontSize: 30,
        fontFamily: 'Cursive'
      }}
      onChangeText={(thoughts)=>{setThoughts(thoughts)}}
      multiline={true}
      placeholder="What's on your mind today?"
      placeholderTextColor="#888"
    />
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setModalVisible(!modalVisible);
      }}>
      <View style={
        {
          justifyContent: 'center',
          alignSelf: 'center',
          width: 350,
          marginTop: 150
        }
      }>
        <View style={styles.modalView}>
          <Text style={{ fontFamily: 'Nlight', color: 'white', fontSize: 25 }}>User Profile</Text>
          <View style={{ backgroundColor: 'yellow', height: 200, width: 200, borderRadius: 100, top: 20 }}>
            <Image
              source={{ uri: user.imageUrl }}
              style={{
                height: '100%',
                width: '100%',
                borderRadius: 100
              }}
            /></View>
          <Text style={{ fontFamily: 'Nlight', color: 'white', fontSize: 30, top: 30 }}>{user.firstName}</Text>
          <Text style={{ fontFamily: 'Nlight', color: 'white', fontSize: 15, top: 40 }}>{user.emailAddresses[0]?.emailAddress}</Text>
          <TouchableOpacity><Pressable
            style={{
              width: 250, height: 50, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center', borderRadius: 25, alignSelf: 'baseline', top: 100
            }}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={{ fontFamily: 'Nlight', color: 'white', fontSize: 20 }}>Close</Text>
          </Pressable></TouchableOpacity>
        </View>
      </View>
    </Modal>
    <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
      <Text style={styles.signOutText}>Sign Out</Text>
    </TouchableOpacity>

    <TouchableOpacity style={{width:180,backgroundColor:'#212121',height:50,justifyContent:'center',
      alignItems:'center',
      borderRadius:50,alignSelf:'center'
    }} onPress={database}>
      <Text style={styles.signOutText}>+ Add Thoughts</Text>
    </TouchableOpacity>
  </View>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 16
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    height: 500,
    backgroundColor: '#212121',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
    fontFamily: 'Nitalic',
  },
  signOutButton: {
    width: 120,
    height: 50,
    backgroundColor: '#212121',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    top: -585,
    left: 250
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  signOutText: {
    color: 'red',
    fontSize: 20,
    fontFamily: 'Nlight',
  },
});