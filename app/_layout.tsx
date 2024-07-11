import { StyleSheet, Text, View } from 'react-native'
import { Slot, Stack } from 'expo-router'
import React from 'react'

const RootLayout = () => {
  // Using Stack
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown:false}}/>
    </Stack>
  )

  // Using Slot - Basically renders the current child route
  // return <Slot />

  // Normal Way
  // return (
  //   <View style={styles.container}>
  //     <Text>RootLayout</Text>
  //   </View>
  // )
}

export default RootLayout

const styles = StyleSheet.create({
  container:{
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})