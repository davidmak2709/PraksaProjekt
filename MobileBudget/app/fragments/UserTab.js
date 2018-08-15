import React from "react";
import {
	StyleSheet,
	ScrollView,
	Dimensions,
	AsyncStorage,
	View,
	Alert,
	TouchableHighlight,
	KeyboardAvoidingView
} from "react-native";
import LoadingDataDialog from "../components/LoadingDataDialog";
import ErrorDialog from "../components/ErrorDialog";
import {
	Text,
	FormLabel,
	FormInput,
	Button,
	SocialIcon,
	Icon
} from "react-native-elements";

const { height, width } = Dimensions.get("window");
export default class UserTab extends React.Component {
	static token;
	static oldUsername;
	constructor() {
		super();
		this.state = {
			username: "",
			email: "",
			firstname: "",
			lastname: "",
			passwordModalVisible: false,
			loading: true,
			errorDialogVisible: false,
			errorMsg: "",
			userDataModalVisible: true,
			passwordVisible: false,
			rPasswordVisible: false,
			oldPasswordVisible: false,
			password1: "",
			password2: "",
			oldPassword: ""
		};

		this._getUserData();
	}

	logoutUser() {
		AsyncStorage.removeItem("userToken");
		this.props.navigation.navigate("Auth");
	}

	_getUserData = async () => {
		const userToken = await AsyncStorage.getItem("userToken");
		token = userToken;

		fetch("http://46.101.226.120:8000/api/rest-auth/user/", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Token " + token
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				this.setState({
					username: responseJson.username,
					email: responseJson.email,
					firstname: responseJson.first_name,
					lastname: responseJson.last_name,
					loading: false
				});
				oldUsername = responseJson.username;
			})
			.catch(error => {
				Alert.alert("Error","No Internet connection");
			});
	};

	saveUserData() {
		fetch("http://46.101.226.120:8000/api/rest-auth/user/", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Token " + token
			},
			body: JSON.stringify({
				username: this.state.username,
				email: this.state.email,
				first_name: this.state.firstname,
				last_name: this.state.lastname
			})
		})
			.then(response => {
				if (response.status == 200) {
					Alert.alert("Result", "Data successfully updated.");
					this.setState({ userDataModalVisible: true });
				} else {
					response.json().then(data => {
						if (data.username) {
							this.setState({
								errorMsg: data.username.join(),
								errorDialogVisible: true
							});
						}
					});
				}
			})
			.catch(error => {
				Alert.alert("Error","No Internet connection");

			});
	}

	saveNewPassword() {
		if (
			this.state.password1 != "" &&
			this.state.password2 != "" &&
			this.state.oldPassword != ""
		) {
			fetch("http://46.101.226.120:8000/api/rest-auth/password/change/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Token " + token,
					OLD_PASSWORD_FIELD_ENABLED: "True"
				},
				body: JSON.stringify({
					new_password1: this.state.password1,
					new_password2: this.state.password2,
					old_password: this.state.oldPassword
				})
			})
				.then(response => response.json())
				.then(responseJson => {
					let resultMessage = "";

					if (responseJson.new_password2)
						resultMessage = resultMessage.concat(
							responseJson.new_password2.join("\n")
						);

					if (responseJson.detail)
						resultMessage = resultMessage.concat(responseJson.detail);

					Alert.alert("Result", resultMessage);
				})
				.catch(error => {
					Alert.alert("Error","No Internet connection");

				});
		}
	}

	render() {
		return (
			<View>
				{this.state.loading ? <LoadingDataDialog /> : null}

				<ScrollView
					contentContainerstyle={{
						flex: 1,
						justifyContent: "flex-start",
						alignItems: "center",
						padding: 20
					}}
				>
					<View style={styles.listItem}>
						<View>
							<Text style={{ fontSize: 18 }}>User data</Text>
							<Text style={{ fontSize: 11 }}>Edit user data</Text>
						</View>
						<Icon
							color={!this.state.userDataModalVisible ? "green" : "gray"}
							name={
								!this.state.userDataModalVisible ? "person" : "person-outline"
							}
							onPress={() =>
								this.setState({
									userDataModalVisible: !this.state.userDataModalVisible,
									errorDialogVisible: false
								})
							}
						/>
					</View>
					{this.state.userDataModalVisible ? null : (
						<View style={styles.userDataView}>
							<FormLabel>Username</FormLabel>

							<FormInput
								placeholder="Your Username"
								inputStyle={{ width: width - 100 }}
								ref={usernameRef => (this.usernameRef = usernameRef)}
								onChangeText={username =>
									this.setState({
										username: username,
										errorDialogVisible: false,
										passwordModalVisible: false,
										userDataModalVisible: false
									})
								}
								returnKeyType="none"
								autoCapitalize="none"
								value={this.state.username}
							/>

							<FormLabel>Email</FormLabel>

							<FormInput
								placeholder="Your Email"
								inputStyle={{ width: width - 100 }}
								editable={false}
								value={this.state.email}
							/>

							<FormLabel>First Name</FormLabel>

							<FormInput
								placeholder="Your first name"
								inputStyle={{ width: width - 100 }}
								ref={firstnameRef => (this.firstnameRef = firstnameRef)}
								onChangeText={firstname =>
									this.setState({
										firstname: firstname,
										errorDialogVisible: false,
										passwordModalVisible: false,
										userDataModalVisible: false
									})
								}
								returnKeyType="none"
								autoCapitalize="none"
								value={this.state.firstname}
							/>

							<FormLabel>Last Name</FormLabel>

							<FormInput
								placeholder="Your last name"
								inputStyle={{ width: width - 100 }}
								ref={lastnameRef => (this.lastnameRef = lastnameRef)}
								onChangeText={lastname =>
									this.setState({
										lastname: lastname,
										errorDialogVisible: false,
										passwordModalVisible: false,
										userDataModalVisible: false
									})
								}
								returnKeyType="none"
								autoCapitalize="none"
								value={this.state.lastname}
							/>

							<View style={styles.footer}>
								<TouchableHighlight
									underlayColor="ghostwhite"
									onPress={this.saveUserData.bind(this)}
								>
									<Text style={{ color: "green", fontSize: 18 }}>SAVE</Text>
								</TouchableHighlight>
							</View>
						</View>
					)}
					<View style={styles.listItem}>
						<View>
							<Text style={{ fontSize: 18 }}>Change password</Text>
							<Text style={{ fontSize: 11 }}>Click on the lock icon</Text>
						</View>
						<Icon
							color={this.state.passwordModalVisible ? "green" : "gray"}
							name={this.state.passwordModalVisible ? "lock" : "lock-outline"}
							onPress={() =>
								this.setState({
									passwordModalVisible: !this.state.passwordModalVisible,
									errorDialogVisible: false
								})
							}
						/>
					</View>
					{!this.state.passwordModalVisible ? null : (
						<View style={styles.userDataView}>
							<View style={styles.inputView}>
								<FormInput
									placeholder="Insert new password"
									inputStyle={{ width: width * 0.75 }}
									ref={passwordRef => (this.passwordRef = passwordRef)}
									autoCapitalize="none"
									onChangeText={password1 =>
										this.setState({ password1: password1 })
									}
									returnKeyType="next"
									blurOnSubmit={false}
									secureTextEntry={!this.state.passwordVisible}
									onSubmitEditing={() => this.rPasswordRef.focus()}
								/>
								<Icon
									containerStyle={{ marginTop: 5 }}
									name={this.state.passwordVisible ? "eye" : "eye-off-outline"}
									type="material-community"
									size={22}
									color={this.state.passwordVisible ? "green" : "gray"}
									onPress={() =>
										this.setState({
											passwordVisible: !this.state.passwordVisible
										})
									}
								/>
							</View>

							<View style={styles.inputView}>
								<FormInput
									placeholder="Repeat new password "
									inputStyle={{ width: width * 0.75 }}
									ref={rPasswordRef => (this.rPasswordRef = rPasswordRef)}
									autoCapitalize="none"
									onChangeText={password2 =>
										this.setState({ password2: password2 })
									}
									returnKeyType="next"
									blurOnSubmit={false}
									secureTextEntry={!this.state.rPasswordVisible}
									onSubmitEditing={() => this.oldPasswordRef.focus()}
								/>

								<Icon
									containerStyle={{ marginTop: 5 }}
									name={this.state.rPasswordVisible ? "eye" : "eye-off-outline"}
									type="material-community"
									size={22}
									color={this.state.rPasswordVisible ? "green" : "gray"}
									onPress={() =>
										this.setState({
											rPasswordVisible: !this.state.rPasswordVisible
										})
									}
								/>
							</View>

							<View style={styles.inputView}>
								<FormInput
									placeholder="Insert your old password"
									inputStyle={{ width: width * 0.75 }}
									ref={oldPasswordRef => (this.oldPasswordRef = oldPasswordRef)}
									autoCapitalize="none"
									onChangeText={oldPassword =>
										this.setState({ oldPassword: oldPassword })
									}
									returnKeyType="done"
									blurOnSubmit={true}
									secureTextEntry={!this.state.oldPasswordVisible}
								/>

								<Icon
									containerStyle={{ marginTop: 5 }}
									name={
										this.state.oldPasswordVisible ? "eye" : "eye-off-outline"
									}
									type="material-community"
									size={22}
									color={this.state.oldPasswordVisible ? "green" : "gray"}
									onPress={() =>
										this.setState({
											oldPasswordVisible: !this.state.oldPasswordVisible
										})
									}
								/>
							</View>

							<View style={styles.footer}>
								<TouchableHighlight
									underlayColor="ghostwhite"
									onPress={this.saveNewPassword.bind(this)}
								>
									<Text style={{ color: "green", fontSize: 18 }}>SAVE</Text>
								</TouchableHighlight>
							</View>
						</View>
					)}

					<View style={styles.listItem}>
						<View>
							<Text style={{ fontSize: 18 }}>Logout</Text>
							<Text style={{ fontSize: 11 }}>Click on the power icon</Text>
						</View>
						<Icon
							color="red"
							name="power-settings-new"
							onPress={this.logoutUser.bind(this)}
						/>
					</View>
				</ScrollView>
				<ErrorDialog
					visible={this.state.errorDialogVisible}
					message={this.state.errorMsg}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	listItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderBottomWidth: 1,
		borderColor: "lightgray",
		padding: 20
	},
	userDataView: {
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: "flex-start",
		borderBottomWidth: 1,
		borderColor: "lightgray",
		padding: 20
	},

	inputView: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-evenly"
	},
	footer: {
		justifyContent: "flex-end",
		padding: 20
	}
});
