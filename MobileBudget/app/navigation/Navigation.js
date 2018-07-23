import { createStackNavigator, createSwitchNavigator } from "react-navigation";

import LoginScreen from "../screens/Login/LoginScreen";
import AuthLoadingScreen from "../screens/AuthLoading/AuthLoadingScreen";
import SignupScreen from "../screens/Signup/SignupScreen";

import navTab from "./TabNavigation";

const AppStack = createStackNavigator({
	Home: {
		screen: navTab,
		navigationOptions: ({ navigation }) => ({
			header: null
		})
	}
});

const AuthStack = createStackNavigator({
	Login: LoginScreen,
	Signup: SignupScreen
});

export default (navSwitch = createSwitchNavigator(
	{
		AuthLoading: AuthLoadingScreen,
		App: AppStack,
		Auth: AuthStack
	},
	{
		initialRouteName: "AuthLoading"
	}
));
