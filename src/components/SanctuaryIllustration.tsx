import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ecosystemIcons, ecosystemLabels } from '../domain/catalog';
import { EcosystemId, EcosystemState, ExpansionArea, SeasonalEvent } from '../domain/types';
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

type Props = {
  ecosystems: Record<EcosystemId, EcosystemState>;
  expansions: ExpansionArea[];
  seasonalEvent: SeasonalEvent;
  reducedMotion: boolean;
};

export function SanctuaryIllustration({ ecosystems, expansions, seasonalEvent, reducedMotion }: Props) {
  const ownedAreas = expansions.filter((area) => area.owned).length;
  return (
    <View style={[styles.card, { backgroundColor: seasonalEvent.colors[0] }]} accessibilityLabel={`Top down sanctuary map during ${seasonalEvent.title}. ${ownedAreas} expansion areas owned.`}>
      {expansions.filter((area) => !area.owned).slice(0, 3).map((area, index) => <View key={area.id} style={[styles.fog, fogPositions[index]]}><Text style={styles.fogText}>Lv {area.levelRequired}</Text></View>)}
      <View style={styles.pond}><Text style={styles.pondText}>💧</Text></View>
      <View style={styles.bridge} />
      <View style={styles.pathOne} />
      <View style={styles.pathTwo} />
      {terrain.map((item) => <Text key={`${item.emoji}-${item.top}-${item.left}`} style={[styles.terrain, { top: item.top, left: item.left }]}>{item.emoji}</Text>)}
      {seasonalEvent.ambientEffects.slice(0, reducedMotion ? 1 : 2).map((effect, index) => <Text key={effect} style={[styles.effect, { top: 28 + index * 42, right: 26 + index * 48 }]}>{effect.includes('fire') ? '✨' : effect.includes('snow') ? '❄️' : '🍃'}</Text>)}
      {(Object.keys(ecosystems) as EcosystemId[]).map((id, index) => (
        <View key={id} style={[styles.badge, badgePositions[index]]}>
          <Text style={styles.badgeTitle}>{ecosystemIcons[id]} {ecosystemLabels[id].replace('Flower ', '').replace('Wildlife ', '')}</Text>
          <Text style={styles.badgeLevel}>Level {ecosystems[id].level} • {ecosystems[id].xp} XP</Text>
        </View>
      ))}
      <View style={styles.avatar}><Text>🧑🏽‍🌾</Text></View>
      <Text style={styles.zoomHint}>Pinch to zoom • tap areas • fog reveals by level</Text>
    </View>
  );
}

const badgePositions = [{ top: spacing(1.5), left: spacing(1.5) }, { top: spacing(2), right: spacing(1.5) }, { bottom: spacing(4.5), left: spacing(1.5) }, { bottom: spacing(4.5), right: spacing(1.5) }];
const fogPositions = [{ top: -44, right: -18 }, { bottom: -38, right: 50 }, { top: 120, left: -60 }];

const styles = StyleSheet.create({
  card: { minHeight: 330, borderRadius: 34, overflow: 'hidden', borderWidth: 1, borderColor: '#D8D0BE', marginVertical: spacing(2), ...shadows.soft },
  fog: { position: 'absolute', width: 150, height: 150, borderRadius: 90, backgroundColor: 'rgba(247,244,234,0.78)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(95,125,78,0.12)' },
  fogText: { color: palette.forest, fontWeight: '900', opacity: 0.52 },
  pond: { position: 'absolute', bottom: 54, left: 26, width: 116, height: 86, borderRadius: 48, backgroundColor: palette.sky, borderWidth: 8, borderColor: '#9EAA7C', alignItems: 'center', justifyContent: 'center' },
  pondText: { fontSize: 30 },
  bridge: { position: 'absolute', bottom: 128, left: 104, width: 72, height: 24, borderRadius: 12, backgroundColor: '#B88D5B', transform: [{ rotate: '-12deg' }] },
  pathOne: { position: 'absolute', top: 88, left: 150, width: 74, height: 188, borderRadius: 80, backgroundColor: 'rgba(247,244,234,0.46)', transform: [{ rotate: '28deg' }] },
  pathTwo: { position: 'absolute', top: 168, left: 74, width: 220, height: 44, borderRadius: 40, backgroundColor: 'rgba(247,244,234,0.44)', transform: [{ rotate: '-18deg' }] },
  terrain: { position: 'absolute', fontSize: 31 },
  effect: { position: 'absolute', fontSize: 20, opacity: 0.78 },
  badge: { position: 'absolute', backgroundColor: 'rgba(255,253,247,0.9)', paddingHorizontal: spacing(1.5), paddingVertical: spacing(1), borderRadius: radii.card },
  badgeTitle: { fontWeight: '800', color: palette.dark, fontSize: 13 },
  badgeLevel: { color: palette.dark, fontSize: 11, opacity: 0.75 },
  avatar: { position: 'absolute', top: '48%', left: '47%', width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4D2A7', borderWidth: 2, borderColor: palette.dark },
  zoomHint: { position: 'absolute', bottom: 14, alignSelf: 'center', color: palette.dark, fontSize: 12, opacity: 0.64 }
});
