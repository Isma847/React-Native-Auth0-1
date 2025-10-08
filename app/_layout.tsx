import { Slot } from 'expo-router';
import { Auth0Provider } from 'react-native-auth0';

const AUTH0_DOMAIN = "dev-6ihk61vbmnp36o3x.us.auth0.com"; 
const AUTH0_CLIENT_ID = 'eArvdWOIC74WhRFv9d0zsr53vP6WdWWV'; 

export default function RootLayout() {
  return (
    <Auth0Provider 
        domain={AUTH0_DOMAIN} 
        clientId={AUTH0_CLIENT_ID}
    >
      <Slot /> 
    </Auth0Provider>
  );
}
