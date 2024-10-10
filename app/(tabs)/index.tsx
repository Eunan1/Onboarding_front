import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import axios from 'axios';
import { launchSession, LaunchSessionResult } from '@trinsic/expo-ui';

/**
 * A screen that displays an "Onboarding" title and a button to start the onboarding
 * process. When the button is pressed, it fetches a launch URL from a backend API and
 * uses it to launch an onboarding session. If the launch URL is not available, it shows
 * an error message. If the session fails to launch, it shows an error message.
 */
export default function App() {
  const [launchUrl, setLaunchUrl] = useState(null);

  /**
   * Fetches a launch URL from the backend and updates the component state.
   * If the fetch fails, shows an error message.
   * @returns {Promise<string | null>} The launch URL if successful, null otherwise.
   */
  const fetchLaunchUrl = async () => {
    try {
      const response = await axios.get('http://localhost:8000/create_session');
      setLaunchUrl(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching launch URL:', error);
      Alert.alert('Error', 'Failed to fetch launch URL from backend');
    }
  };

  /**
   * Fetches a launch URL from the backend and uses it to launch an onboarding
   * session. If the fetch fails, shows an error message. If the session fails to
   * launch, shows an error message.
   * @returns {Promise<void>}
   */
  const startOnboarding = async () => {
    const url = await fetchLaunchUrl();
    if (!url) return;
    try {
      const result = await launchSession(url, { callbackPath: '/' });
      console.log(result); // Handle session result
    } catch (error) {
      console.error('Error launching session:', error);
      Alert.alert('Error', 'Failed to launch onboarding session');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Onboarding</Text>
      <Button title="Start Onboarding" onPress={startOnboarding} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    marginBottom: 40,
    fontWeight: 'bold',
  },
});
