import React, {useEffect, useState} from 'react';
import {View, Button, Text, StyleSheet, NativeModules} from 'react-native';
import TestModule from './test-module';
const VPNManager = NativeModules;

const App = () => {
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
      a => {
        console.log(a, 'success');
      },
      a => {
        console.log(a, 'error');
      },
    );
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>
        VPN Status: {vpnStatus ? 'Connected' : 'Disconnected'}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default App;
