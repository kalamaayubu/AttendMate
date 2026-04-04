import React, { useEffect, useRef } from "react";
import { Animated, type StyleProp, type ViewStyle } from "react-native";

type SkeletonBoxProps = {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Simple pulsing placeholder for loading states (matches slate-200 / gray card feel).
 */
export function SkeletonBox({
  width,
  height,
  borderRadius = 8,
  className,
  style,
}: SkeletonBoxProps) {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.95,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.38,
          duration: 750,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      className={className}
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: "#e2e8f0",
          opacity,
        },
        style,
      ]}
    />
  );
}
