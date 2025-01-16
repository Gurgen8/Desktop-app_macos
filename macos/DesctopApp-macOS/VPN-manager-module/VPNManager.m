

#import <Foundation/Foundation.h>
#import "VPNManager.h"
#import <NetworkExtension/NetworkExtension.h>



@implementation VPNManager {
  NETunnelProviderManager *vpnManager;
}



RCT_EXPORT_MODULE();

- (BOOL)requiresMainQueueSetup
{
  return false;
}

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

RCT_EXPORT_METHOD(configureVPN:(NSDictionary *)config resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  if (!vpnManager) {
    reject(@"no_manager", @"VPN Manager is not initialized", nil);
    return;
  }
  
  vpnManager.localizedDescription = @"My VPN";
  NEVPNProtocolIKEv2 *protocol = [[NEVPNProtocolIKEv2 alloc] init];
  
  protocol.serverAddress = config[@"serverAddress"];
  protocol.username = config[@"username"];
  protocol.passwordReference = [self keychainReferenceFor:config[@"password"]];
  protocol.authenticationMethod = NEVPNIKEAuthenticationMethodNone;
  protocol.useExtendedAuthentication = YES;
  protocol.disconnectOnSleep = NO;
  
  vpnManager.protocolConfiguration = protocol;
  vpnManager.enabled = YES;
  
  [vpnManager saveToPreferencesWithCompletionHandler:^(NSError *error) {
    if (error) {
      reject(@"save_error", @"Failed to save VPN configuration", error);
    } else {
      resolve(@"VPN configuration saved successfully");
    }
  }];
}

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
