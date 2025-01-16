import React, {useEffect, useState} from 'react';
import {View, Button, Text, NativeModules} from 'react-native';
import {styles} from './styles';
import TestModule from '../modules/test-module';
const VPNManager = NativeModules;

export const HomeScreen = () => {
  const [vpnStatus, setVpnStatus] = useState<boolean>(false);

  const toggleVPN = async () => {
    try {
      if (vpnStatus) {
        await VPNManager.disconnect();
      } else {
        await VPNManager.connect();
      }
      setVpnStatus(!vpnStatus);
    } catch (error) {
      console.error('Error toggling VPN:', error);
    }
  };

  const getStatus = async () => {
    try {
      const status = await VPNManager.getStatus();
      console.log(status);
      setVpnStatus(status === 'connected');
    } catch (error) {
      console.error('Error getting VPN status:', error);
    }
  };

  useEffect(() => {
    TestModule.getDeviceID(
      success => {
        console.log(success, 'success');
      },
      error => {
        console.log(error, 'error');
      },
    );
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>
        VPN Status: {vpnStatus ? 'Connected' : 'Disconnected'}
      </Text>
      <Button
        title={vpnStatus ? 'Disconnect VPN' : 'Connect VPN'}
        onPress={toggleVPN}
      />
      <Button title="Check VPN Status" onPress={getStatus} />
    </View>
  );
};
