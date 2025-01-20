import {NativeModules, NativeEventEmitter} from 'react-native';

const {VPNManager} = NativeModules;
const VPNEvents = new NativeEventEmitter(VPNManager);

export const configureVPN = async () => {
  try {
    const response = await VPNManager.connectVPN((message: string) =>
      console.log(message),
    );
    return response;
  } catch (error) {
    console.log(error, 'ERROR');
  }
};

export const connectVPN = async () => {
  try {
    const response = await VPNManager.connect();
    return response;
  } catch (error) {
    throw error;
  }
};

export const disconnectVPN = async () => {
  try {
    const response = await VPNManager.disconnect();
    return response;
  } catch (error) {
    throw error;
  }
};

export const getVPNStatus = async () => {
  try {
    const status = await VPNManager.getStatus();
    return status;
  } catch (error) {
    throw error;
  }
};

export const onVPNStatusChange = (callback: (event: string) => void) => {
  VPNEvents.addListener('VPNStatusChanged', callback);
};

export const removeVPNStatusListener = () => {
  VPNEvents.removeAllListeners('VPNStatusChanged');
};
