import { Image } from 'expo-image';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts, Spacings } from '../../theme';

const ICON_SIZE = 12;
const BACK_SIZE = 28;

type HeaderNavigationProps = {
  component?: ReactNode;
};

const HeaderNavigation = ({ component }: HeaderNavigationProps) => {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={8}
        onPress={() => router.back()}
        style={({ pressed }) => [styles.back, pressed && styles.pressed]}
      >
        {process.env.EXPO_OS === 'ios' ? (
          <Image
            source="sf:chevron.left"
            tintColor={Colors.Labels.primary}
            style={styles.icon}
          />
        ) : (
          <Text style={styles.androidChevron}>‹</Text>
        )}
      </Pressable>
      {component ? <View style={styles.accessory}>{component}</View> : null}
    </View>
  );
};

export default HeaderNavigation;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacings.lg,
    paddingHorizontal: Spacings['2xl'],
  },
  back: {
    width: BACK_SIZE,
    height: BACK_SIZE,
    borderRadius: BACK_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.Backgrounds.secondary,
  },
  pressed: {
    opacity: 0.7,
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  androidChevron: {
    fontFamily: Fonts.medium,
    fontSize: 28,
    lineHeight: 32,
    color: Colors.Labels.primary,
    includeFontPadding: false,
  },
  accessory: {
    flex: 1,
  },
});
