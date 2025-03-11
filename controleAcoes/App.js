import { StyleSheet, Text, View } from 'react-native';
import Menu from './src/components/Menu';
import { AuthProvider } from './src/components/context/authContext';

export default function App() {
  return (
    <AuthProvider>
      <Menu/>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
