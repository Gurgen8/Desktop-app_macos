#import <Foundation/Foundation.h>
#import "LeafVPNManager.h"

@implementation LeafVPNManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(startVPN:(NSString *)config resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    // Путь к Leaf CLI
    NSString *leafPath = [[NSBundle mainBundle] pathForResource:@"leaf" ofType:@""];

    if (!leafPath) {
        reject(@"not_found", @"Leaf executable not found", nil);
        return;
    }

    // Создаем временный файл для конфигурации
    NSString *configPath = [NSTemporaryDirectory() stringByAppendingPathComponent:@"leaf_config.json"];
    NSError *writeError;
    [config writeToFile:configPath atomically:YES encoding:NSUTF8StringEncoding error:&writeError];


    if (writeError) {
        reject(@"config_error", @"Failed to write configuration", writeError);
        return;
    }

    // Запускаем Leaf CLI с конфигурацией
    NSTask *task = [[NSTask alloc] init];
    task.launchPath = leafPath;
    task.arguments = @[@"-c", configPath];

    NSPipe *outputPipe = [NSPipe pipe];
    task.standardOutput = outputPipe;
    task.standardError = outputPipe;


    [task setTerminationHandler:^(NSTask *task) {
           NSLog(@"console.log");
        if (task.terminationStatus == 0) {

            resolve(@YES);
        } else {
            reject(@"vpn_error", @"Failed to start VPN", nil);
        }
    }];

    [task launch];
}

RCT_EXPORT_METHOD(stopVPN:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    // Убедитесь, что процесс Leaf завершен
    system("pkill -f leaf");
    resolve(@YES);
}
@end
