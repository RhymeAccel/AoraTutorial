import {StatusBar} from 'expo-status-bar'
import { Text, View } from 'react-native'
import { Link } from 'expo-router'

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className='text-3xl'>Aora!</Text>
      <StatusBar style="auto" />
      <Link href="/profile" style={{color: 'blue'}}>Go To Profile</Link>
    </View>
  );
}
