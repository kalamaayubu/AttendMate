import Reactotron, { asyncStorage } from "reactotron-react-native";

Reactotron.configure() // controls connection & communication settings
  .use(asyncStorage()) // add async storage plugin
  .useReactNative() // add all built-in react native plugins
  .connect(); // let's connect!
