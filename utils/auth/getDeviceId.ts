import * as Application from "expo-application";
import * as Device from "expo-device";

// Purpose: to get the manufacturer id of the device
export function getDeviceId() {
  const androidId = Application.getAndroidId();
  const model = Device.modelName;
  const manufacturer = Device.manufacturer;

  return `${manufacturer}-${model}-${androidId}`;
}
