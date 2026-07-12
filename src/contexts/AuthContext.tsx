import { useEffect, useState } from 'react';
import type { ReactNode } from "react";
import type { User } from "firebase/auth";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import { AuthContext } from './AuthContextDefinition';
import type { UserData } from './AuthContextDefinition';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    //console.log(user)

    // Observar mudanças no estado de autenticação
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                // Buscar dados adicionais do usuário no Firestore
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    setUserData(userDoc.data() as UserData);
                }
            } else {
                setUserData(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);


    // Login
    const signIn = async (email: string, password: string) => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const upsertSocialUserData = async (providerUser: User) => {
        const userDocRef = doc(db, 'users', providerUser.uid);
        const userDoc = await getDoc(userDocRef);

        const payload: UserData = {
            uid: providerUser.uid,
            email: providerUser.email || '',
            displayName: providerUser.displayName || 'Usuário',
            photoURL: providerUser.photoURL || undefined,
            createdAt: userDoc.exists() ? (userDoc.data() as UserData).createdAt : new Date()
        };

        await setDoc(userDocRef, payload, { merge: true });
        setUserData(payload);
    };

    // Login social com Google
    const signInWithGoogle = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            await upsertSocialUserData(result.user);
        } catch (error) {
            console.error('Erro no login com Google:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Login social com GitHub
    const signInWithGitHub = async () => {
        setLoading(true);
        try {
            const provider = new GithubAuthProvider();
            const result = await signInWithPopup(auth, provider);
            await upsertSocialUserData(result.user);
        } catch (error) {
            console.error('Erro no login com GitHub:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Registro
    const signUp = async (email: string, password: string, name: string) => {
        setLoading(true);
        try {
            // Criar usuário no Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUser = userCredential.user;

            // Atualizar perfil com nome
            await updateProfile(newUser, {
                displayName: name
            });

            // Salvar dados adicionais no Firestore
            const userData: UserData = {
                uid: newUser.uid,
                email: newUser.email || email,
                displayName: name,
                createdAt: new Date()
            };

            await setDoc(doc(db, 'users', newUser.uid), userData);
            setUserData(userData);
        } catch (error) {
            console.error('Erro no registro:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Logout
    const logout = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            setUser(null);
            setUserData(null);
        } catch (error) {
            console.error('Erro no logout:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Recuperar senha
    const resetPassword = async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            console.error('Erro ao recuperar senha:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            userData,
            loading,
            signIn,
            signUp,
            signInWithGoogle,
            signInWithGitHub,
            logout,
            resetPassword
        }}>
            {children}
        </AuthContext.Provider>
    );
};
