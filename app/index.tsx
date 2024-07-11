import {StatusBar} from 'expo-status-bar'
import {StyleSheet, Text, View } from 'react-native'
import { Link } from 'expo-router'

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Aora!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
})
