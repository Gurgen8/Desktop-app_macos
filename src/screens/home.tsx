import React, {useEffect, useState} from 'react';
import {View, Button, Text} from 'react-native';
import {styles} from './styles';
import {
  configureVPN,
  connectVPN,
  disconnectVPN,
  getVPNStatus,
  onVPNStatusChange,
  removeVPNStatusListener,
} from '../modules/vpn-manager-module';

export const HomeScreen = () => {
  const [vpnStatus, setVpnStatus] = useState<string>('');

  useEffect(() => {
    const listener = (newStatus: React.SetStateAction<string>) => {
      setVpnStatus(newStatus);
    };

    onVPNStatusChange(listener);

    return () => {
      removeVPNStatusListener();
    };
  }, []);

  const setupVPN = async () => {
    await configureVPN();
  };

  const connect = async () => {
    await connectVPN();
    const currentStatus = await getVPNStatus();
    setVpnStatus(currentStatus);
  };

  const disconnect = async () => {
    await disconnectVPN();
    const currentStatus = await getVPNStatus();
    setVpnStatus(currentStatus);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>
        VPN Status: {vpnStatus ? vpnStatus : 'Disconnected'}
      </Text>
      <Button title={'Connect VPN'} onPress={connect} />
      <Button title={'Disconnect VPN'} onPress={disconnect} />
      <Button title="Setup VPN" onPress={setupVPN} />
    </View>
  );
};
