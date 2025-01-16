import {NativeModules} from 'react-native';

const {TestModule} = NativeModules;

interface ITestModule {
  getDeviceAttributes(
    successCallback: (res: any) => void,
    errorCallback: (error: any) => void,
  ): void;
  getDeviceID(
    successCallback: (res: any) => void,
    errorCallback: (error: any) => void,
  ): void;
}

export default TestModule as ITestModule;
