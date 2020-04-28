import messaging from '@react-native-firebase/messaging';
import { useEffect, useState } from "react";
export default function useFirebaseFCMService() {
    const [loader, setLoader] = useState(true)
    const [fcmToken, setFcmToken] = useState("")
    const [remoteMessage, setRemoteMessage] = useState()

    async function registerAppWithFCM() {
        await messaging().registerDeviceForRemoteMessages();
    }
    async function requestUserPermission() {
        const settings = await messaging().requestPermission();

        if (settings) {
            console.log('Permission settings:', settings);
        }
    }

    function onNotificationOpenedApp() {
        messaging().onNotificationOpenedApp(remoteMessage => setRemoteMessage(remoteMessage))
    }

    function getInitialNotification() {
        messaging()
            .getInitialNotification()
            .then(remoteMessage => setRemoteMessage(remoteMessage));
    }

    function getToken() {
        messaging()
            .getToken()
            .then(token => {
                setFcmToken(token);
                setLoader(false)
            });
    }

    function firebaseMessageCalls() {
        registerAppWithFCM();
        requestUserPermission();
        getToken();
        messaging.NotificationAndroidPriority.PRIORITY_MAX;
        messaging.NotificationAndroidVisibility.VISIBILITY_PUBLIC;
        messaging.AuthorizationStatus.AUTHORIZED;
        onNotificationOpenedApp();
        getInitialNotification();
    }
    useEffect(() => {
        firebaseMessageCalls();
        return () => {
            messaging().onTokenRefresh(token => {
                setFcmToken(token);
                setLoader(false);
            })
        };
    }, []);

    return {
        loader,
        fcmToken,
        remoteMessage,
    }
}