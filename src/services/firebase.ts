
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, push } from "firebase/database";

// Firebase configuration - replace with your own config when deploying
const firebaseConfig = {
  apiKey: "AIzaSyD0sHXm9Gge2ZqJf0Qw-NzuVb8QlFbCxVk",
  authDomain: "plc-dashboard-demo.firebaseapp.com",
  databaseURL: "https://plc-dashboard-demo-default-rtdb.firebaseio.com",
  projectId: "plc-dashboard-demo",
  storageBucket: "plc-dashboard-demo.appspot.com",
  messagingSenderId: "375086862092",
  appId: "1:375086862092:web:e3c1ac6b5f5cdeb1fee9ac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to save PLC data to Firebase
export const savePLCDataToFirebase = (plcId: string, dataPoint: any) => {
  try {
    const plcDataRef = ref(database, `plc-data/${plcId}`);
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
  const plcDataRef = ref(database, `plc-data/${plcId}`);
  
  onValue(plcDataRef, (snapshot) => {
    const data = snapshot.val();
    const dataArray = data ? Object.values(data) : [];
    callback(dataArray);
  });
};

// Function to save PLC configuration to Firebase
export const savePLCConfiguration = (plcConfig: any) => {
  try {
    const configRef = ref(database, `plc-configurations/${plcConfig.id}`);
    set(configRef, plcConfig);
    return true;
  } catch (error) {
    console.error("Error saving PLC configuration:", error);
    return false;
  }
};
