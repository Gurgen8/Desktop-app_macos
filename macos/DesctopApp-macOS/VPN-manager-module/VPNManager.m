

#import <Foundation/Foundation.h>
#import "VPNManager.h"
#import <NetworkExtension/NetworkExtension.h>

@implementation VPNManager {
  NETunnelProviderManager *vpnManager;
}


RCT_EXPORT_MODULE();

- (instancetype)init {
  self = [super init];
  if (self) {
    [self loadVPNManager];
  }
  return self;
}

- (void)loadVPNManager {
  [NETunnelProviderManager loadAllFromPreferencesWithCompletionHandler:^(NSArray<NETunnelProviderManager *> *managers, NSError *error) {
    if (error) {
      NSLog(@"Failed to load VPN managers: %@", error.localizedDescription);
    } else {
      self->vpnManager = managers.firstObject ?: [[NETunnelProviderManager alloc] init];
    }
  }];
}

RCT_EXPORT_METHOD(connectVPN:(RCTResponseSenderBlock)callback) {
    NEVPNManager *vpnManager = [NEVPNManager sharedManager];
  
    [vpnManager loadFromPreferencesWithCompletionHandler:^(NSError *error) {
        if (error != nil) {
            callback(@[@"Ошибка загрузки настроек VPN", error.localizedDescription]);
            return;
        }

        // Настройка VPN-подключения
        NEVPNProtocolIKEv2 *vpnProtocol = [[NEVPNProtocolIKEv2 alloc] init];
        vpnProtocol.username = @"yourUsername";
        vpnProtocol.passwordReference = @"password"; 
        vpnProtocol.serverAddress = @"vpn.server.com";
        vpnProtocol.remoteIdentifier = @"vpn.server.com";
        vpnProtocol.localIdentifier = @"localIdentifier";
        vpnManager.protocolConfiguration = vpnProtocol;
        vpnManager.enabled = YES;
        NSLog(@"console.log");
        
        // Сохранение настроек VPN и подключение
         [vpnManager saveToPreferencesWithCompletionHandler:^(NSError *error) {

        // // Запуск VPN-подключения
            NSError *startError = nil;
            [vpnManager.connection startVPNTunnelAndReturnError:&startError];
            
            if (startError != nil) {
                callback(@[@"Ошибка при подключении к VPN", startError.localizedDescription]);
            } else {
                callback(@[@"VPN подключен успешно"]);
            }
        }];
    }];
}

// RCT_EXPORT_METHOD(configureVPN:(NSDictionary *)config resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
//   if (!vpnManager) {
//     reject(@"no_manager", @"VPN Manager is not initialized", nil);
//     return;
//   }
//   NSLog(@"Received VPN Config: %@", config);
  
//   vpnManager.localizedDescription = @"My VPN";
//   NEVPNProtocolIKEv2 *protocol = [[NEVPNProtocolIKEv2 alloc] init];
  
//   // Установка параметров конфигурации
//   protocol.serverAddress = config[@"serverAddress"];
//   protocol.username = config[@"username"];
//   protocol.password = config[@"password"];

//   // Установка ссылки на пароль (должна быть ссылка из keychain)
//   NSData *passwordReference = [self getPasswordReferenceForKey:config[@"password"]];
//   if (!passwordReference) {
//     reject(@"invalid_password", @"Failed to retrieve password reference from keychain", nil);
//     return;
//   }
//   protocol.passwordReference = passwordReference;

//   // Установка метода аутентификации
//   protocol.authenticationMethod = NEVPNIKEAuthenticationMethodNone;
//   protocol.useExtendedAuthentication = YES;
//   protocol.disconnectOnSleep = NO;

//   vpnManager.protocolConfiguration = protocol;
//   vpnManager.enabled = YES;

//   [vpnManager saveToPreferencesWithCompletionHandler:^(NSError *error) {
//     if (error) {
//       reject(@"save_error", @"Failed to save VPN configuration", error);
//     } else {
//       resolve(@"VPN configuration saved successfully");
//     }
//   }];
// }

RCT_EXPORT_METHOD(connect:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  if (!vpnManager) {
    reject(@"no_manager", @"VPN Manager is not initialized", nil);
    return;
  }
  
  NSError *error;
  [vpnManager.connection startVPNTunnelAndReturnError:&error];
  if (error) {
    reject(@"connection_error", @"Failed to start VPN connection", error);
  } else {
    resolve(@"VPN connected");
  }
}

RCT_EXPORT_METHOD(disconnect:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  if (!vpnManager) {
    reject(@"no_manager", @"VPN Manager is not initialized", nil);
    return;
  }
  
  [vpnManager.connection stopVPNTunnel];
  resolve(@"VPN disconnected");
}

RCT_EXPORT_METHOD(getStatus:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  if (!vpnManager) {
    reject(@"no_manager", @"VPN Manager is not initialized", nil);
    return;
  }
  
  NEVPNStatus status = vpnManager.connection.status;
  NSString *statusString;
  
  switch (status) {
    case NEVPNStatusInvalid:
      statusString = @"Invalid";
      break;
    case NEVPNStatusDisconnected:
      statusString = @"Disconnected";
      break;
    case NEVPNStatusConnecting:
      statusString = @"Connecting";
      break;
    case NEVPNStatusConnected:
      statusString = @"Connected";
      break;
    case NEVPNStatusReasserting:
      statusString = @"Reasserting";
      break;
    case NEVPNStatusDisconnecting:
      statusString = @"Disconnecting";
      break;
    default:
      statusString = @"Unknown";
      break;
  }
  
  resolve(statusString);
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"VPNStatusChanged"];
}

@end

