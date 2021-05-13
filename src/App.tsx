import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
//import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { withAuthenticator } from 'aws-amplify-react-native';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

// Amplify modules
import Amplify from 'aws-amplify';
import config from './aws-exports';

// React library modules
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// User defined files
import Home from './screens/Home';
import Capture from './screens/Capture';

Amplify.configure({
	...config,
	Analytics: {
		disabled: true,
	},
});

function App() {
	const Stack = createStackNavigator();
	const isLoadingComplete = useCachedResources();
	const colorScheme = useColorScheme();

	if (!isLoadingComplete) {
		return null;
	} else {
		return (
			<SafeAreaProvider>
			<Navigation colorScheme={colorScheme} />
			<StatusBar style="auto" />
			</SafeAreaProvider>
		);
	}
}

export default withAuthenticator(App);