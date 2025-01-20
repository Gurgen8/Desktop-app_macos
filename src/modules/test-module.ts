import {NativeModules} from 'react-native';

const {TestModule} = NativeModules;

interface ITestModule {
  getDeviceAttributes(
    successCallback: (success: unknown) => void,
    errorCallback: (error: unknown) => void,
  ): void;
  getDeviceID(
    successCallback: (success: unknown) => void,
    errorCallback: (error: unknown) => void,
  ): void;
}

export default TestModule as ITestModule;
