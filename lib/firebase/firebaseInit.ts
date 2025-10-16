// lib/firebase/getFirebaseApp.ts
import firebase from "@react-native-firebase/app";

// Initialize Firebase only once
export function getFirebaseApp() {
  if (!firebase.apps.length) {
    firebase.app(); // Uses google-services.json automatically
    console.log("🔥 Firebase initialized");
  }
  return firebase.app();
}
