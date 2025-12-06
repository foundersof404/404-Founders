import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SignupScreen } from './src/screens/auth/SignupScreen';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { HomeScreen } from './src/screens/main/HomeScreen';

type Screen = 'signup' | 'login' | 'home';

export default function App() {
    const [currentScreen, setCurrentScreen] = useState<Screen>('signup');
    const [userName, setUserName] = useState('Mhmmd');

    const handleSignupSuccess = () => {
        setCurrentScreen('login');
    };

    const handleLoginSuccess = () => {
        setCurrentScreen('home');
    };

    const handleNavigateToLogin = () => {
        setCurrentScreen('login');
    };

    const handleNavigateToSignup = () => {
        setCurrentScreen('signup');
    };

    // Render the current screen
    return (
        <SafeAreaProvider>
            {currentScreen === 'signup' && (
                <SignupScreen
                    onSignupSuccess={handleSignupSuccess}
                    onNavigateToLogin={handleNavigateToLogin}
                />
            )}
            {currentScreen === 'login' && (
                <LoginScreen
                    onLoginSuccess={handleLoginSuccess}
                    onNavigateToSignup={handleNavigateToSignup}
                />
            )}
            {currentScreen === 'home' && (
                <HomeScreen userName={userName} />
            )}
        </SafeAreaProvider>
    );
}
