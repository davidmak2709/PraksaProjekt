import { createStackNavigator, createSwitchNavigator } from "react-navigation";
import {Easing, Animated} from "react-native";

import LoginScreen from "../screens/Login/LoginScreen";
import AuthLoadingScreen from "../screens/AuthLoading/AuthLoadingScreen";
import SignupScreen from "../screens/Signup/SignupScreen";
import TransactionScreen from "../screens/Transaction/TransactionScreen";
import CameraScreen from "../screens/Camera/CameraScreen";
import WalletTransactions from "../screens/WalletTransactions/WalletTransactions";
import NewWalletDialog from "../components/NewWalletDialog";

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
	Camera: {
		screen: CameraScreen,
		navigationOptions: ({ navigation }) => ({
			title: `Camera scan`,
		})
	},
	NewWalletDialog: {
		screen: NewWalletDialog,
		navigationOptions: ({ navigation }) => ({
			header: null,
		})
	},
	WalletTransactions: {
		screen: WalletTransactions,
		navigationOptions: ({ navigation }) => ({
			title: `Details`,
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
