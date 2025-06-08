import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import Login from './src/Login';
import Home from './src/Home';
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { Slot } from 'expo-router'

const Stack = createNativeStackNavigator();

const App = () => {



  const [fontsLoaded] = useFonts({
    'Nlight': require('./assets/Nunito/static/Nunito-Light.ttf'),
    'Nitalic': require('./assets/Nunito/static/Nunito-Italic.ttf'),
    'Cursive': require('./assets/Caveat/static/Caveat-Regular.ttf')
  });
  useEffect(() => {
    if (fontsLoaded) {
      //SplashScreenOptions.hideAsync()
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'>
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ClerkProvider>
  );
};
export default App;