import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useEffect, useState } from 'react';

GoogleSignin.configure({
  webClientId:
    '920885184027-agd83oaipqa7is9hauao9u2qblgpdgi2.apps.googleusercontent.com',
});

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>();

  // Handle user state changes
  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {    
    // request permission
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  const googleSignin = async () => {
    try {
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const res = await auth().signInWithCredential(googleCredential);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 10,
          elevation: 10,
          shadowColor: 'black',
          shadowOpacity: 0.2,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 0 },
        }}
        onPress={googleSignin}
      >
        <Text>Sign in with Google</Text>
      </TouchableOpacity>
      <Image
        source={{ uri: user?.photoURL }}
        style={{ width: 100, height: 100, marginTop: 20 }}
      />
      <Text>User : {user?.displayName}</Text>
      <Text>Email : {user?.email}</Text>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
