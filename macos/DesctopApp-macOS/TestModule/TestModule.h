#ifndef TestModule_h
#define TestModule_h

#import <React/RCTBridgeModule.h>
@interface TestModule : NSObject <RCTBridgeModule>

- (void) getDeviceID: (RCTResponseSenderBlock)successCallback errorCallback: (RCTResponseSenderBlock)errorCallback;
- (void) getDeviceAttributes: (RCTResponseSenderBlock)successCallback errorCallback: (RCTResponseSenderBlock)errorCallback;

@end

#endif 
