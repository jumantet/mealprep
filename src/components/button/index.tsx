import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Colors, Fonts, Radius, Text as TextTokens } from '@theme';

type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  title: string;
  style?: StyleProp<ViewStyle>;
};

const Button = ({ title, disabled, style, ...props }: ButtonProps) => {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        disabled ? styles.disabled : styles.enabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
      {...props}
    >
      <Text style={[styles.label, disabled && styles.labelDisabled]}>{title}</Text>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: Radius.full,
  },
  enabled: {
    backgroundColor: Colors.Accents.green,
  },
  disabled: {
    backgroundColor: Colors.Backgrounds.secondary,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    fontFamily: Fonts.semiBold,
    fontSize: TextTokens.Sizes.h5,
    letterSpacing: TextTokens.Tracking.button,
    color: TextTokens.Colors.onAccent,
    includeFontPadding: false,
  },
  labelDisabled: {
    color: TextTokens.Colors.quaternary,
  },
});
