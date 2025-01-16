#import <Foundation/Foundation.h>
#import "TestModule.h"

@implementation TestModule
// Export Test Module
RCT_EXPORT_MODULE(TestModule);

// Get device id method
RCT_EXPORT_METHOD(getDeviceID: (RCTResponseSenderBlock)successCallback errorCallback: (RCTResponseSenderBlock)errorCallback)
{
  @try{
    // Implement get device id logic
    NSString *deviceID = @ "testdeviceId-456";
    successCallback(@[deviceID]);
  }
  @catch(NSException *exception){
    errorCallback(@[exception]);
  }
}

// Get device attributes method
RCT_EXPORT_METHOD(getDeviceAttributes: (RCTResponseSenderBlock)successCallback errorCallback: (RCTResponseSenderBlock)errorCallback)
{
  @try{
    // Implement get device attributes logic
    NSDictionary *deviceAttributes = @{
      @"isDeviceRooted": @"IOSTestRooted",
      @"isDevModeEnabled": @"IOSDevMode",
      @"isADBEnabled" : @"IOSADBEnabled"
    };
    successCallback(@[deviceAttributes]);
  }
  @catch(NSException *exception){
    errorCallback(@[exception]);
  }
}

@end
