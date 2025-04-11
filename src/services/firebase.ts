import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, push } from "firebase/database";

// Firebase configuration
// IMPORTANT: Replace these placeholder values with your own Firebase project credentials
// Get your credentials from the Firebase console: https://console.firebase.google.com/
const firebaseConfig = {
  apiKey: "AIzaSyByNDDxXK_plHoZUHVGT6HQQTuMti1rckc",
  authDomain: "plcwebapp.firebaseapp.com",
  databaseURL: "https://plcwebapp-default-rtdb.firebaseio.com/",
  projectId: "plcwebapp",
  storageBucket: "plcwebapp.firebasestorage.app",
  messagingSenderId: "424899404299",
  appId: "1:424899404299:web:640112c4531b145674dd0e"
};


// Check if Firebase credentials have been configured
const isConfigured = () => {
  return !(
    firebaseConfig.apiKey === "AIzaSyByNDDxXK_plHoZUHVGT6HQQTuMti1rckc" ||
    firebaseConfig.authDomain === "plcwebapp.firebaseapp.com" ||
    firebaseConfig.databaseURL === "https://plcwebapp-default-rtdb.firebaseio.com/"
  );
};

// Initialize Firebase
let app;
let database;

try {
  if (isConfigured()) {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    console.log("Firebase initialized successfully");
  } else {
    console.warn("Firebase is not configured with valid credentials");
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

// Function to save PLC data to Firebase
export const savePLCDataToFirebase = (plcId: string, dataPoint: any) => {
  if (!isConfigured() || !database) {
    console.warn("Firebase is not properly configured. Data not saved.");
    return false;
  }
  
  try {
    const plcDataRef = ref(database, plc-data/${plcId});
    const newDataRef = push(plcDataRef);
    set(newDataRef, {
      ...dataPoint,
      timestamp: dataPoint.timestamp || new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error("Error saving data to Firebase:", error);
    return false;
  }
};

// Function to listen for PLC data updates
export const subscribeToPLCData = (plcId: string, callback: (data: any[]) => void) => {
  if (!isConfigured() || !database) {
    console.warn("Firebase is not properly configured. Cannot subscribe to data.");
    callback([]);
    return () => {}; // Return empty unsubscribe function
  }
  
  const plcDataRef = ref(database, plc-data/${plcId});
  
  const unsubscribe = onValue(plcDataRef, (snapshot) => {
    const data = snapshot.val();
    const dataArray = data ? Object.values(data) : [];
    callback(dataArray);
  });
  
  return unsubscribe;
};

// Function to save PLC configuration to Firebase
export const savePLCConfiguration = (plcConfig: any) => {
  if (!isConfigured() || !database) {
    console.warn("Firebase is not properly configured. Configuration not saved.");
    return false;
  }
  
  try {
    const configRef = ref(database, plc-configurations/${plcConfig.id});
    set(configRef, plcConfig);
    return true;
  } catch (error) {
    console.error("Error saving PLC configuration:", error);
    return false;
  }
};

// Check if Firebase is configured with valid credentials
export const isFirebaseConfigured = isConfigured;
