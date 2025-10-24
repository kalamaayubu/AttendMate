export default {
  expo: {
    name: "Attendmate",
    slug: "attendmate",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
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
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
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
      manifest: {
        additions: [
          {
            type: "meta-data",
            "android:name":
              "com.google.firebase.messaging.default_notification_color",
            "android:resource": "@color/notification_icon_color",
            "tools:replace": "android:resource",
          },
        ],
      },
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
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
          icon: "./assets/images/icon.png",
          color: "#4A90E2",
        },
      ],
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: { backgroundColor: "#000000" },
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
