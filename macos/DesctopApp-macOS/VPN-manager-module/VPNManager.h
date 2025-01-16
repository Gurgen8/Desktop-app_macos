#ifndef VPNManager_h
#define VPNManager_h

#import <React/RCTBridgeModule.h>
@interface VPNManager : NSObject <RCTBridgeModule>

- (NSData *)keychainReferenceFor:(NSString *)password;

@end

#endif
