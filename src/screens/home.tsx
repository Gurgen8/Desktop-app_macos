import React, {useState} from 'react';
import {View, Button, Text} from 'react-native';
import {styles} from './styles';
import {startVPN, stopVPN} from '../modules/leaf-vpn-manager';

export const HomeScreen = () => {
  const [vpnStatus, setVpnStatus] = useState<string>('');

  const connectVpn = async () => {
    const statusVpn = await startVPN();
    statusVpn && setVpnStatus('Connected');
  };

  const disconnect = async () => {
    const statusVpn = await stopVPN();
    statusVpn && setVpnStatus('Disconnected');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>
        VPN Status: {vpnStatus ? vpnStatus : '---'}
      </Text>
      <Button
        disabled={vpnStatus === 'Connected'}
        title={'Connect VPN'}
        onPress={connectVpn}
      />
      <Button
        disabled={vpnStatus !== 'Connected'}
        title={'Disconnect VPN'}
        onPress={disconnect}
      />
    </View>
  );
};
