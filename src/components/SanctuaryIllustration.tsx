import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ecosystems } from '../data/mosslightContent';
import { palette, radii, shadows, spacing } from '../styles/theme';

const terrain = [
  { emoji: '🌲', top: '5%', left: '9%' },
  { emoji: '🌳', top: '13%', left: '25%' },
  { emoji: '🦊', top: '20%', left: '42%' },
  { emoji: '🌸', top: '18%', left: '65%' },
  { emoji: '🌼', top: '34%', left: '75%' },
  { emoji: '🐰', top: '49%', left: '82%' },
  { emoji: '🦋', top: '63%', left: '72%' },
  { emoji: '🍄', top: '70%', left: '24%' },
  { emoji: '🪷', top: '58%', left: '17%' },
  { emoji: '✨', top: '9%', left: '78%' }
];

export function SanctuaryIllustration() {
  return (
    <View style={styles.card} accessibilityLabel="Top down sanctuary map with forest, garden, pond, and wildlife meadow">
      <View style={styles.fogTop} />
      <View style={styles.pond}><Text style={styles.pondText}>💧</Text></View>
      <View style={styles.bridge} />
      <View style={styles.pathOne} />
      <View style={styles.pathTwo} />
      {terrain.map((item) => (
        <Text key={`${item.emoji}-${item.top}-${item.left}`} style={[styles.terrain, { top: item.top, left: item.left }]}>{item.emoji}</Text>
      ))}
      {ecosystems.map((ecosystem, index) => (
        <View key={ecosystem.id} style={[styles.badge, badgePositions[index]]}>
          <Text style={styles.badgeTitle}>{ecosystem.label.replace('Flower ', '').replace('Wildlife ', '')}</Text>
          <Text style={styles.badgeLevel}>Level {ecosystem.level}</Text>
        </View>
      ))}
      <View style={styles.avatar}><Text>🧑🏽‍🌾</Text></View>
      <Text style={styles.zoomHint}>Pinch to zoom • tap to discover</Text>
    </View>
  );
}

const badgePositions = [
  { top: spacing(1.5), left: spacing(1.5) },
  { top: spacing(2), right: spacing(1.5) },
  { bottom: spacing(4.5), left: spacing(1.5) },
  { bottom: spacing(4.5), right: spacing(1.5) }
];

const styles = StyleSheet.create({
  card: {
    minHeight: 330,
    borderRadius: 34,
    overflow: 'hidden',
    backgroundColor: '#CAD69B',
    borderWidth: 1,
    borderColor: '#D8D0BE',
    marginVertical: spacing(2),
    ...shadows.soft
  },
  fogTop: {
    position: 'absolute',
    top: -70,
    right: -30,
    width: 170,
    height: 170,
    borderRadius: 100,
    backgroundColor: 'rgba(247,244,234,0.72)'
  },
  pond: {
    position: 'absolute',
    bottom: 54,
    left: 26,
    width: 116,
    height: 86,
    borderRadius: 48,
    backgroundColor: palette.sky,
    borderWidth: 8,
    borderColor: '#9EAA7C',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pondText: { fontSize: 30 },
  bridge: {
    position: 'absolute',
    bottom: 128,
    left: 104,
    width: 72,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#B88D5B',
    transform: [{ rotate: '-12deg' }]
  },
  pathOne: {
    position: 'absolute',
    top: 88,
    left: 150,
    width: 74,
    height: 188,
    borderRadius: 80,
    backgroundColor: 'rgba(247,244,234,0.46)',
    transform: [{ rotate: '28deg' }]
  },
  pathTwo: {
    position: 'absolute',
    top: 168,
    left: 74,
    width: 220,
    height: 44,
    borderRadius: 40,
    backgroundColor: 'rgba(247,244,234,0.44)',
    transform: [{ rotate: '-18deg' }]
  },
  terrain: { position: 'absolute', fontSize: 31 },
  badge: {
    position: 'absolute',
    backgroundColor: 'rgba(255,253,247,0.9)',
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(1),
    borderRadius: radii.card
  },
  badgeTitle: { fontWeight: '800', color: palette.dark, fontSize: 13 },
  badgeLevel: { color: palette.dark, fontSize: 11, opacity: 0.75 },
  avatar: {
    position: 'absolute',
    top: '48%',
    left: '47%',
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4D2A7',
    borderWidth: 2,
    borderColor: palette.dark
  },
  zoomHint: {
    position: 'absolute',
    bottom: 14,
    alignSelf: 'center',
    color: palette.dark,
    fontSize: 12,
    opacity: 0.64
  }
});
