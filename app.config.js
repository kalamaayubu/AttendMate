export default {
  expo: {
    name: "Attendmate",
    slug: "attendmate",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/amLogo.png",
    scheme: "attendmate",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anonymous.attendmate",
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/amLogo.png",
        backgroundImage: "./assets/images/amLogo.png",
        monochromeImage: "./assets/images/amLogo.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.anonymous.attendmate",
      googleServicesFile:
        process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
      intentFilters: [
        {
          action: "VIEW",
          data: [{ scheme: "attendmate" }],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
      // For automatic updates
      updates: {
        enabled: true,
        checkAutomatically: "ON_LOAD", // check on app start
        fallbackToCacheTimeout: 0, // immediately use cached version if offline
      },
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "./plugins/withFirebaseNotificationFix",
      [
        "@react-native-firebase/app",
        {
          googleServicesFile:
            process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
        },
      ],
      [
        "expo-notifications",
        {
          icon: "./assets/images/amLogo.png",
          color: "#4A90E2",
        },
      ],
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/amLogo.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          light: { backgroundColor: "#ffffff" },
        },
      ],
      "expo-web-browser",
      [
        "expo-sqlite",
        {
          enableFTS: true,
          useSQLCipher: true,
          android: { enableFTS: false, useSQLCipher: false },
          ios: {
            customBuildFlags: [
              "-DSQLITE_ENABLE_DBSTAT_VTAB=1 -DSQLITE_ENABLE_SNAPSHOT=1",
            ],
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "cc3ecdd7-02ed-49ee-8f01-63ca8212e32c",
      },
    },
  },
};
