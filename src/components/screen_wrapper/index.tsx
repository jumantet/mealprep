import React, { forwardRef } from 'react';
import type { ViewProps } from 'react-native';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { NativeSafeAreaViewInstance } from 'react-native-safe-area-context';

type ScreenWrapperProps = ViewProps & {
  children: React.ReactNode;
  safeArea?: boolean;
  safeAreaEdges?: ('top' | 'bottom' | 'left' | 'right')[];
};

const ScreenWrapper = forwardRef<NativeSafeAreaViewInstance, ScreenWrapperProps>(
  ({ safeArea = true, safeAreaEdges, style, children, ...props }, ref) => {
    if (safeArea || (safeAreaEdges && safeAreaEdges.length > 0)) {
      return (
        <SafeAreaView
          ref={ref}
          edges={safeAreaEdges}
          style={[{ flex: 1 }, style]}
          {...props}
        >
          {children}
        </SafeAreaView>
      );
    }

    return (
      <View ref={ref} style={[{ flex: 1 }, style]} {...props}>
        {children}
      </View>
    );
  }
);

ScreenWrapper.displayName = 'ScreenWrapper';

export default ScreenWrapper;
