import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { Colors, Fonts, Radius, Spacings, Text as TextTokens } from '@theme';

import SkeletonBone from './skeleton_bone';

const CARD_GAP = Spacings.lg;
const SIDE_PADDING = Spacings['2xl'];
const LINE_HEIGHTS = [14, 14, 14, 14, 14, 10];

const MealCardSkeleton = () => {
  const { width } = useWindowDimensions();
  const cardWidth = width - SIDE_PADDING * 2;

  return (
    <View style={styles.row} pointerEvents="none">
      <View style={[styles.card, { width: cardWidth }]}>
        <SkeletonBody />
      </View>
      <View style={[styles.card, styles.peek, { width: cardWidth }]}>
        <SkeletonBody />
      </View>
    </View>
  );
};

const SkeletonBody = () => (
  <View style={styles.content}>
    <SkeletonBone style={styles.day} />
    <SkeletonBone style={styles.mealName} />
    <View style={styles.metaRow}>
      <SkeletonBone style={styles.meta} />
      <SkeletonBone style={styles.meta} />
      <SkeletonBone style={styles.meta} />
    </View>
    <Text style={styles.sectionTitle}>Ingredients</Text>
    {LINE_HEIGHTS.map((flex, index) => (
      <SkeletonBone
        key={`ingredient-${index}`}
        style={[styles.line, { width: `${60 + flex * 4}%` }]}
      />
    ))}
    <Text style={styles.sectionTitle}>Recipe</Text>
    {LINE_HEIGHTS.map((flex, index) => (
      <SkeletonBone
        key={`recipe-${index}`}
        style={[styles.line, { width: `${70 + flex * 3}%` }]}
      />
    ))}
  </View>
);

export default MealCardSkeleton;

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: SIDE_PADDING,
    overflow: 'hidden',
  },
  card: {
    flexGrow: 0,
    flexShrink: 0,
    height: '100%',
    overflow: 'hidden',
    borderRadius: Radius.lg,
    borderCurve: 'continuous',
    backgroundColor: Colors.Backgrounds.primary,
  },
  peek: {
    marginLeft: CARD_GAP,
  },
  content: {
    padding: Spacings['2xl'],
    gap: Spacings.sm,
  },
  day: {
    width: 148,
    height: TextTokens.Sizes.h3,
  },
  mealName: {
    width: 188,
    height: TextTokens.Sizes.h5,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacings.lg,
    marginTop: Spacings.xs,
    marginBottom: Spacings.md,
  },
  meta: {
    width: 72,
    height: TextTokens.Sizes.p2,
  },
  sectionTitle: {
    marginTop: Spacings.lg,
    fontFamily: Fonts.semiBold,
    fontSize: TextTokens.Sizes.h5,
    color: TextTokens.Colors.primary,
  },
  line: {
    height: 14,
  },
});
