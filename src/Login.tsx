import { View, Text, Image, TouchableOpacity } from "react-native";
import { useOAuth, useAuth } from '@clerk/clerk-expo';
import React, { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
WebBrowser.maybeCompleteAuthSession();

export default function Login({ navigation }) {
  
  const { isSignedIn } = useAuth();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  useEffect(() => {
    if (isSignedIn) {
      navigation.replace('Home');
    }
  }, [isSignedIn, navigation]);

  const onGooglePress = React.useCallback(async () => {
    try {
      const { createdSessionId } = await startOAuthFlow();
      
      if (createdSessionId) {
        navigation.replace('Home');
      }
    } catch (err) {
      if (err.message === "You're already signed in.") {
        navigation.replace('Home');
      } else {
        console.error("OAuth error:", err);
      }
    }
  }, [startOAuthFlow, navigation]);



  return (
    <View style={{ backgroundColor: 'black', height: '100%', width: '100%', padding: 16 }}>
      <Text style={{ color: 'white', fontSize: 40, top: 70, left: 10, fontFamily: 'Nitalic' }}>EveryNote</Text>
      <Text style={{ color: 'white', fontSize: 15, top: 80, left: 10, letterSpacing: 1, fontFamily: 'Nlight' }}>Capture your thoughts your way.</Text>
      <Text style={{ color: 'white', fontSize: 15, top: 80, left: 10, letterSpacing: 1, fontFamily: 'Nlight' }}>
        Text voice or media--<Text style={{ fontFamily: 'Cursive', fontSize: 20 }}>EveryNote</Text> makes it effortless to record your day and reflect with AI-powered clarity.
      </Text>

      <Image
        source={require('./png/typewriter.png')}
        style={{ width: 300, height: 300, opacity: 1, alignSelf: 'center', top: 140 }}
      />

      {/* Social Login Buttons */}
      <View style={{ position: 'absolute', bottom: 100, width: '100%', alignSelf: 'center', paddingHorizontal: 16 }}>
        <TouchableOpacity
          onPress={onGooglePress}
          style={{
            backgroundColor: 'white',
            height: 48,
            width: '100%',
            borderRadius: 30,
            marginBottom: 16,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <Image
            source={require('./png/google.png')}
            style={{
              height: 24,
              width: 24,
              marginRight: 12
            }}
          />
          <Text style={{
            color: 'black',
            fontSize: 16,
            fontFamily: 'Nlight'
          }}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#212121',
            height: 48,
            width: '100%',
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}
          onPress={()=>{navigation.navigate('Home')}}>
          <Image
            source={require('./png/apple.png')}
            style={{
              height: 24,
              width: 24,
              marginRight: 12
            }}
          />
          <Text style={{
            color: 'white',
            fontSize: 16,
            fontFamily: 'Nlight'
          }}>Continue with Apple</Text>
        </TouchableOpacity>
      </View>

      <Text style={{
        color: '#3f403f',
        fontFamily: 'Nlight',
        fontSize: 12,
        position: 'absolute',
        bottom: 40,
        width: '100%',
        textAlign: 'center',
        alignSelf: 'center',
        paddingHorizontal: 16
      }}>
        By continuing, you agree to our Terms of Service and Privacy Policy
      </Text>
    </View>
  );
}
