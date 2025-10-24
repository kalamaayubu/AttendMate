const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withFirebaseNotificationFix(config) {
  return withAndroidManifest(config, async (config) => {
    const manifest = config.modResults.manifest;

    if (!manifest["uses-sdk"]) manifest["uses-sdk"] = [];

    const app = Array.isArray(manifest.application)
      ? manifest.application[0]
      : manifest.application;

    if (!app["meta-data"]) app["meta-data"] = [];

    app["meta-data"] = app["meta-data"].filter(
      (item) =>
        item["$"]?.["android:name"] !==
        "com.google.firebase.messaging.default_notification_color"
    );

    app["meta-data"].push({
      $: {
        "android:name":
          "com.google.firebase.messaging.default_notification_color",
        "android:resource": "@android:color/white",
        "tools:replace": "android:resource",
      },
    });

    if (!manifest.$["xmlns:tools"]) {
      manifest.$["xmlns:tools"] = "http://schemas.android.com/tools";
    }

    return config;
  });
};
