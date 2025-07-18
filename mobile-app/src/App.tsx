import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import TrackPlayer from 'react-native-track-player';

import { store, persistor } from './store';
import { AppNavigator } from './navigation/AppNavigator';
import { ThemeProvider } from './contexts/ThemeContext';
import { LocalizationProvider } from './contexts/LocalizationContext';
import { LoadingScreen } from './components/LoadingScreen';
import { setupTrackPlayer } from './services/audioService';
import { PAKISTANI_COLORS } from './constants/theme';

const App: React.FC = () => {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize audio player
        await setupTrackPlayer();
        
        // Hide splash screen after initialization
        setTimeout(() => {
          SplashScreen.hide();
        }, 1000);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        SplashScreen.hide();
      }
    };

    initializeApp();

    // Cleanup function
    return () => {
      TrackPlayer.destroy();
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <SafeAreaProvider>
          <ThemeProvider>
            <LocalizationProvider>
              <NavigationContainer>
                <StatusBar 
                  barStyle="light-content" 
                  backgroundColor={PAKISTANI_COLORS.primary}
                  translucent={false}
                />
                <AppNavigator />
              </NavigationContainer>
            </LocalizationProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PAKISTANI_COLORS.background,
  },
});

export default App;