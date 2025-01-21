import {NativeModules} from 'react-native';
import {LeafConfig} from '../config';

const {LeafVPNManager} = NativeModules;

async function startVPN() {
  try {
    const success = await LeafVPNManager.startVPN(JSON.stringify(LeafConfig));
    console.log('VPN started:', success);
  } catch (error) {
    console.error('Failed to start VPN:', error);
  }
}

async function stopVPN() {
  try {
    const success = await LeafVPNManager.stopVPN();
    console.log('VPN stopped:', success);
  } catch (error) {
    console.error('Failed to stop VPN:', error);
  }
}

export {startVPN, stopVPN};
