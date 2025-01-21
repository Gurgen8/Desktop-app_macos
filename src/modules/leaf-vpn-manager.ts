import {NativeModules} from 'react-native';
import {LeafConfig} from '../config';

const {LeafVPNManager} = NativeModules;

export const startVPN = async () => {
  try {
    const success = await LeafVPNManager.startVPN(JSON.stringify(LeafConfig));
    return success;
  } catch (error) {
    console.error('Failed to start VPN:', error);
  }
};

export const stopVPN = async () => {
  try {
    const success = await LeafVPNManager.stopVPN();
    return success;
  } catch (error) {
    console.error('Failed to stop VPN:', error);
  }
};
