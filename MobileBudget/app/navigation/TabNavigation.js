import React from "react";
import { Dimensions } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createBottomTabNavigator } from "react-navigation";

import HomeTab from "../fragments/HomeTab";
import SettingsTab from "../fragments/SettingsTab";
import UserTab from "../fragments/UserTab";
import WalletTab from "../fragments/WalletsTab";

const { height, width } = Dimensions.get("window");

const navTab = createBottomTabNavigator(
	{
		Home: HomeTab,
		Status: SettingsTab,
		Wallets: WalletTab,
		User: UserTab
	},
	{
		navigationOptions: ({ navigation }) => ({
			tabBarIcon: ({ focused, tintColor }) => {
				const { routeName } = navigation.state;
				let iconName;
				if (routeName === "Home") {
					iconName = `ios-home${focused ? "" : "-outline"}`;
				} else if (routeName === "Status") {
					iconName = `ios-barcode${focused ? "" : "-outline"}`;
				} else if (routeName === "User") {
					iconName = `ios-person${focused ? "" : "-outline"}`;
				} else if (routeName === "Wallets") {
					iconName = `ios-briefcase`;
				}

				return <Ionicons name={iconName} size={35} color={tintColor} />;
			}
		}),
		tabBarOptions: {
			activeTintColor: "green",
			inactiveTintColor: "gray",
			style: {
				height: height * 0.1
			},
			labelStyle: {
				marginBottom: 2,
				fontSize: 12
			}
		}
	}
);

export default navTab;
