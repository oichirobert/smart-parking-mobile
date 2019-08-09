import React, { useEffect, useState } from 'react'
import { Text, View, ScrollView, Button } from 'react-native';
import { Auth } from 'aws-amplify';

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default function AccountContainer() {
  const [userData, setUserData] = useState({
    attributes: {
      email: '',
      phone_number: ''
    }
  });

  useEffect(() => {
    async function fetchCurrentUser(){
      try {
        const user = await Auth.currentAuthenticatedUser();
        setUserData(user); 
      } catch (error) {
        // TODO
      }
    }
    
    fetchCurrentUser();
  });

  const { attributes: { email, phone_number } } = userData;

  return <UserDetails email={email} phone_number={phone_number} />
}

function UserDetails({ email = '', phone_number = '' }: { email: string, phone_number: string }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      <View>
      <Text>Email: {email}</Text>
      <Text>Phone: {phone_number}</Text>
      </View>
    </ScrollView>
  )
}
