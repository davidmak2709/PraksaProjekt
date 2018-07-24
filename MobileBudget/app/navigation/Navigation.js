import { createStackNavigator, createSwitchNavigator } from "react-navigation";

import LoginScreen from "../screens/Login/LoginScreen";
import AuthLoadingScreen from "../screens/AuthLoading/AuthLoadingScreen";
import SignupScreen from "../screens/Signup/SignupScreen";
import TransactionScreen from "../screens/Transaction/TransactionScreen";
import navTab from "./TabNavigation";

const AppStack = createStackNavigator({
	Home: {
		screen: navTab,
		navigationOptions: ({ navigation }) => ({
			header: null
		})
	},
	Transaction : {
		screen : TransactionScreen,
		navigationOptions: ({ navigation }) => ({
			title: `Add new transaction`,
		})
	},

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
