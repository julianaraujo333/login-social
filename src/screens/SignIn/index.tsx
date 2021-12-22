import React from 'react';
import { View } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as Facebook from "expo-facebook";

import { useNavigation } from '@react-navigation/native';

import { Button } from '../../components/Button';
import { SignInContent } from '../../components/SignInContent';

const {CLIENT_ID} = process.env;
const {REDIRECT_URI} = process.env;

import { styles } from './styles';

type AuthResponse = {
  type: string;
  params: {
    access_token: string;
  }
}

export function SignIn() {
  const navigation = useNavigation();

  async function handleSignInFacebook() {
    try {
      await Facebook.initializeAsync({
        appId: '1066453793921965',
        appName: 'partiulogin'
      });
      const { type, token } =
        await Facebook.logInWithReadPermissionsAsync({
          permissions: ['public_profile', 'email'],
        }) as AuthResponse;
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        navigation.navigate('Profile', {token: token, type: 'facebook'});      
      } 
    } catch ({ message }) {
    }
  }

  async function handleSignIn() {
    const RESPONSE_TYPE = 'token';
    const SCOPE = encodeURI('profile email');

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

    const {type, params} = await AuthSession.startAsync({ authUrl }) as AuthResponse;

    if(type === 'success'){
      navigation.navigate('Profile', {token: params.access_token, type: 'google'});
    }
  }

  return (
    <View style={styles.container}>
      <SignInContent />

      <Button
        title="Entrar com Google"
        icon="social-google"
        onPress={handleSignIn}
      />
      <Button
        title="Entrar com Facebook"
        icon="social-facebook"
        onPress={handleSignInFacebook}
      />
    </View>
  );
}