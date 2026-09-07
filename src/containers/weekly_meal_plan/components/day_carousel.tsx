import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ViewToken,
} from 'react-native';

import { Spacings } from '@theme';

import type { DayMeal, WeekDayId } from 'types/meal_plan';
import { WEEK_DAYS } from 'types/meal_plan';

import MealCard from './meal_card';

const CARD_GAP = Spacings.lg;
const SIDE_PADDING = Spacings['2xl'];

type DayCarouselProps = {
  days: DayMeal[];
  selectedDay: WeekDayId;
  onSelectDay: (day: WeekDayId) => void;
};

const DayCarousel = ({ days, selectedDay, onSelectDay }: DayCarouselProps) => {
  const listRef = useRef<FlatList<DayMeal>>(null);
  const selectedDayRef = useRef(selectedDay);
  const onSelectDayRef = useRef(onSelectDay);
  const skipNextScrollRef = useRef(false);
  const [listHeight, setListHeight] = useState(0);
  const { width } = useWindowDimensions();
  const cardWidth = width - SIDE_PADDING * 2;
  const interval = cardWidth + CARD_GAP;

  selectedDayRef.current = selectedDay;
  onSelectDayRef.current = onSelectDay;

  useEffect(() => {
    if (skipNextScrollRef.current) {
      skipNextScrollRef.current = false;
      return;
    }
    const index = WEEK_DAYS.findIndex(item => item.id === selectedDay);
    if (index < 0) {
      return;
    }
    listRef.current?.scrollToOffset({ offset: index * interval, animated: true });
  }, [interval, selectedDay]);

  const syncDayFromIndex = useCallback((index: number) => {
    const day = WEEK_DAYS[index]?.id;
    if (!day || day === selectedDayRef.current) {
      return;
    }
    skipNextScrollRef.current = true;
    onSelectDayRef.current(day);
  }, []);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const index = viewableItems[0]?.index;
      if (index != null) {
        syncDayFromIndex(index);
      }
    }
  ).current;

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    syncDayFromIndex(Math.round(event.nativeEvent.contentOffset.x / interval));
  };

  return (
    <View
      style={styles.frame}
      onLayout={event => setListHeight(event.nativeEvent.layout.height)}
    >
      <FlatList
        ref={listRef}
        horizontal
        data={days}
        keyExtractor={item => item.day}
        renderItem={({ item }) => (
          <View style={[styles.page, { width: cardWidth, height: listHeight }]}>
            <MealCard meal={item} />
          </View>
        )}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={interval}
        snapToAlignment="start"
        disableIntervalMomentum
        contentContainerStyle={styles.content}
        getItemLayout={(_, index) => ({
          length: interval,
          offset: interval * index,
          index,
        })}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        onViewableItemsChanged={onViewableItemsChanged}
        onMomentumScrollEnd={onMomentumScrollEnd}
        style={styles.list}
      />
    </View>
  );
};

export default DayCarousel;

const styles = StyleSheet.create({
  frame: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SIDE_PADDING,
  },
  page: {
    marginRight: CARD_GAP,
  },
});
