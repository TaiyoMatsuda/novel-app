import React from "react";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { RecoilRoot } from 'recoil';
import { AppNavigator } from './src/navigation/AppNavigator';


export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          <RecoilRoot>
            <AppNavigator />
          </RecoilRoot>
        </SafeAreaView>
      </PaperProvider>
    </SafeAreaProvider>
  );
}