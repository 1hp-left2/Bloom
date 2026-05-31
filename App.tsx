import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, Pressable, View, useWindowDimensions } from 'react-native';
import { HabitCard } from './src/components/HabitCard';
import { SanctuaryIllustration } from './src/components/SanctuaryIllustration';
import { ecosystems, friends, onboarding, rareDiscoveries, shopItems, todayHabits, Habit } from './src/data/mosslightContent';
import { nextExpansion, unlockedRewards } from './src/game/mosslight';
import { palette, radii, shadows, spacing } from './src/styles/theme';

type Tab = 'Home' | 'Sanctuary' | 'Friends' | 'Shop' | 'Profile';

const mainPages = [
  'Home', 'Sanctuary Map', 'Forest Detail', 'Flower Garden Detail', 'Pond Detail', 'Wildlife Detail', 'Habit Detail',
  'Add Habit', 'Edit Habit', 'Achievements', 'Statistics', 'Inventory', 'Shop', 'Friends', 'Friend Gardens',
  'Notifications', 'Profile', 'Settings', 'Premium', 'Seasonal Events', 'Search', 'Help Center', 'Feedback'
];

export default function App() {
  const [tab, setTab] = useState<Tab>('Home');
  const [habits, setHabits] = useState(todayHabits);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const { width } = useWindowDimensions();
  const compact = width < 430;
  const completedCount = habits.filter((habit) => habit.completed).length;
  const sanctuaryLevel = 14;
  const upcomingExpansion = nextExpansion(sanctuaryLevel);
  const discovery = useMemo(() => rareDiscoveries[completedCount % rareDiscoveries.length], [completedCount]);

  function completeHabit(habit: Habit) {
    setHabits((current) => current.map((item) => item.id === habit.id ? { ...item, completed: true } : item));
  }

  if (showOnboarding) {
    return <Onboarding onFinish={() => setShowOnboarding(false)} />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={palette.cream} />
      <ScrollView contentContainerStyle={[styles.container, compact && styles.compact]} showsVerticalScrollIndicator={false}>
        <Header />
        {tab === 'Home' && (
          <>
            <StatsRow streak={23} level={sanctuaryLevel} completed={completedCount} />
            <SanctuaryIllustration />
            <SectionHeader title="Today’s nurturing" action="Gentle reminders" />
            {habits.map((habit) => <HabitCard key={habit.id} habit={habit} streak={23} onComplete={completeHabit} />)}
            <DiscoveryCard discovery={discovery} upcomingExpansion={upcomingExpansion?.name ?? 'Living Paradise'} />
          </>
        )}
        {tab === 'Sanctuary' && <SanctuaryScreen />}
        {tab === 'Friends' && <FriendsScreen />}
        {tab === 'Shop' && <ShopScreen />}
        {tab === 'Profile' && <ProfileScreen />}
      </ScrollView>
      <TabBar active={tab} onChange={setTab} />
    </SafeAreaView>
  );
}

function Header() {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.kicker}>☀️ Good morning, Aria</Text>
        <Text style={styles.subtle}>Keep growing your sanctuary.</Text>
      </View>
      <Pressable style={styles.notification} accessibilityRole="button" accessibilityLabel="Notifications">🔔</Pressable>
    </View>
  );
}

function StatsRow({ streak, level, completed }: { streak: number; level: number; completed: number }) {
  return (
    <View style={styles.statsRow}>
      <View style={styles.statCard}><Text style={styles.statIcon}>⭐</Text><Text style={styles.statValue}>{streak}</Text><Text style={styles.statLabel}>Day streak</Text></View>
      <View style={styles.statCard}><Text style={styles.statIcon}>🌿</Text><Text style={styles.statValue}>Lv. {level}</Text><Text style={styles.statLabel}>Sanctuary Level</Text></View>
      <View style={styles.statCard}><Text style={styles.statIcon}>🫧</Text><Text style={styles.statValue}>{completed}/4</Text><Text style={styles.statLabel}>Nurtured today</Text></View>
    </View>
  );
}

function SanctuaryScreen() {
  return (
    <View>
      <SectionHeader title="Sanctuary map" action="Fog reveals at Lv. 15" />
      <SanctuaryIllustration />
      <Text style={styles.bodyCopy}>Pan, zoom, and tap the living map to find wildlife, decorations, rare plants, and seasonal particles. Gentle neglect may add small weeds or fewer butterflies, but progress is never deleted.</Text>
      {ecosystems.map((ecosystem) => (
        <View key={ecosystem.id} style={styles.ecosystemCard}>
          <Text style={styles.ecosystemIcon}>{ecosystem.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{ecosystem.label} • Level {ecosystem.level}</Text>
            <Text style={styles.subtle}>{ecosystem.description}</Text>
            <Text style={styles.unlocks}>Unlocked: {unlockedRewards(ecosystem.id, ecosystem.level).join(', ')}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function FriendsScreen() {
  return (
    <View>
      <SectionHeader title="Friend gardens" action="No rankings" />
      <Text style={styles.bodyCopy}>Visit sanctuaries, leave Water Drops, Sunshine Boosts, or Encouragement Notes, and celebrate milestones without follower counts.</Text>
      {friends.map((friend) => (
        <View key={friend.name} style={styles.friendCard}>
          <Text style={styles.friendAvatar}>{friend.avatar}</Text>
          <View style={{ flex: 1 }}><Text style={styles.cardTitle}>{friend.name}</Text><Text style={styles.subtle}>Level {friend.level} • {friend.note}</Text></View>
          <Pressable style={styles.smallPill}><Text style={styles.smallPillText}>Visit</Text></Pressable>
        </View>
      ))}
    </View>
  );
}

function ShopScreen() {
  return (
    <View>
      <SectionHeader title="Shop & inventory" action="320 acorns" />
      <Text style={styles.bodyCopy}>Premium cosmetics add rare species, seasonal themes, advanced analytics, decorations, wildlife, and customization. Core progression is never gated.</Text>
      <View style={styles.grid}>
        {shopItems.map((item) => (
          <View key={item.title} style={styles.shopItem}><Text style={styles.shopIcon}>{item.icon}</Text><Text style={styles.cardTitle}>{item.title}</Text><Text style={styles.subtle}>{item.tag} • {item.price}</Text></View>
        ))}
      </View>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View>
      <SectionHeader title="Mosslight profile" action="$6.99/mo Premium" />
      <View style={styles.profileCard}>
        <Text style={styles.logo}>Mosslight</Text>
        <Text style={styles.bodyCopy}>A peaceful living world powered by daily actions: cloud sync, offline mode, push notifications, real-time updates, Supabase auth, seasonal events, and accessible settings.</Text>
        <Text style={styles.cardTitle}>Planned pages</Text>
        <Text style={styles.pageList}>{mainPages.join(' • ')}</Text>
      </View>
    </View>
  );
}

function DiscoveryCard({ discovery, upcomingExpansion }: { discovery: string; upcomingExpansion: string }) {
  return (
    <View style={styles.discoveryCard}>
      <Text style={styles.discoveryTitle}>Recent discovery</Text>
      <Text style={styles.discoveryName}>✨ {discovery}</Text>
      <Text style={styles.subtle}>Next expansion: {upcomingExpansion}. A little more consistency will part the fog.</Text>
    </View>
  );
}

function SectionHeader({ title, action }: { title: string; action: string }) {
  return <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{title}</Text><Text style={styles.sectionAction}>{action}</Text></View>;
}

function TabBar({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  const tabs: Array<{ id: Tab; icon: string }> = [
    { id: 'Home', icon: '⌂' },
    { id: 'Sanctuary', icon: '🗺️' },
    { id: 'Friends', icon: '👥' },
    { id: 'Shop', icon: '🧺' },
    { id: 'Profile', icon: '♡' }
  ];
  return (
    <View style={styles.tabBar}>
      {tabs.map((item) => (
        <Pressable key={item.id} onPress={() => onChange(item.id)} style={[styles.tab, active === item.id && styles.tabActive]} accessibilityRole="tab" accessibilityState={{ selected: active === item.id }}>
          <Text style={styles.tabIcon}>{item.icon}</Text><Text style={styles.tabLabel}>{item.id}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function Onboarding({ onFinish }: { onFinish: () => void }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.onboarding}>
        <Text style={styles.logo}>Mosslight</Text>
        <Text style={styles.tagline}>Small habits. Gentle growth.</Text>
        {onboarding.map((screen) => (
          <View key={screen.headline} style={styles.onboardingCard}>
            <Text style={styles.onboardingIcon}>{screen.icon}</Text><View style={{ flex: 1 }}><Text style={styles.cardTitle}>{screen.headline}</Text><Text style={styles.subtle}>{screen.body}</Text></View>
          </View>
        ))}
        <View style={styles.goalCard}>
          <Text style={styles.cardTitle}>Select goals</Text>
          <Text style={styles.pageList}>Fitness • Learning • Wellness • Creativity • Finance</Text>
          <Text style={styles.subtle}>Choose 3–5 habits, then generate your sanctuary.</Text>
        </View>
        <Pressable style={styles.primaryButton} onPress={onFinish} accessibilityRole="button"><Text style={styles.primaryButtonText}>Start Growing</Text></Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.cream },
  container: { padding: spacing(2), paddingBottom: 112, maxWidth: 640, alignSelf: 'center', width: '100%' },
  compact: { paddingHorizontal: spacing(1.5) },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing(1) },
  kicker: { color: palette.dark, fontSize: 22, fontWeight: '900' },
  subtle: { color: palette.dark, opacity: 0.66, lineHeight: 20 },
  notification: { width: 44, height: 44, borderRadius: 22, backgroundColor: palette.white, alignItems: 'center', justifyContent: 'center', ...shadows.soft },
  statsRow: { flexDirection: 'row', gap: spacing(1), marginTop: spacing(2) },
  statCard: { flex: 1, backgroundColor: palette.white, borderRadius: radii.card, padding: spacing(1.25), borderWidth: 1, borderColor: '#E3DBC9' },
  statIcon: { fontSize: 20 },
  statValue: { color: palette.dark, fontWeight: '900', fontSize: 18, marginTop: 4 },
  statLabel: { color: palette.dark, opacity: 0.62, fontSize: 11 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: spacing(1) },
  sectionTitle: { color: palette.dark, fontSize: 19, fontWeight: '900' },
  sectionAction: { color: palette.forest, fontSize: 12, fontWeight: '800' },
  bodyCopy: { color: palette.dark, opacity: 0.76, lineHeight: 22, marginBottom: spacing(1.5) },
  discoveryCard: { backgroundColor: '#FFF6E0', borderRadius: radii.card, padding: spacing(2), borderWidth: 1, borderColor: '#EEDDAF', marginTop: spacing(1), ...shadows.soft },
  discoveryTitle: { color: palette.dark, fontWeight: '700', opacity: 0.68 },
  discoveryName: { color: palette.dark, fontSize: 23, fontWeight: '900', marginVertical: spacing(0.5) },
  ecosystemCard: { flexDirection: 'row', gap: spacing(1.5), backgroundColor: palette.white, borderRadius: radii.card, padding: spacing(1.5), marginBottom: spacing(1), borderWidth: 1, borderColor: '#E3DBC9' },
  ecosystemIcon: { fontSize: 34 },
  cardTitle: { color: palette.dark, fontWeight: '900', fontSize: 16, marginBottom: 4 },
  unlocks: { color: palette.forest, fontWeight: '700', marginTop: 6, lineHeight: 19 },
  friendCard: { flexDirection: 'row', alignItems: 'center', gap: spacing(1), backgroundColor: palette.white, borderRadius: radii.card, padding: spacing(1.25), marginBottom: spacing(1), borderWidth: 1, borderColor: '#E3DBC9' },
  friendAvatar: { fontSize: 30 },
  smallPill: { backgroundColor: palette.forest, borderRadius: radii.pill, paddingHorizontal: spacing(2), paddingVertical: spacing(0.8) },
  smallPillText: { color: palette.white, fontWeight: '900' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing(1) },
  shopItem: { width: '48%', minHeight: 130, backgroundColor: palette.white, borderRadius: radii.card, padding: spacing(1.5), borderWidth: 1, borderColor: '#E3DBC9', ...shadows.soft },
  shopIcon: { fontSize: 34, marginBottom: spacing(1) },
  profileCard: { backgroundColor: palette.white, borderRadius: radii.card, padding: spacing(2), borderWidth: 1, borderColor: '#E3DBC9' },
  pageList: { color: palette.dark, opacity: 0.74, lineHeight: 23 },
  logo: { color: palette.forest, fontSize: 46, fontWeight: '900', letterSpacing: -2, textAlign: 'center' },
  tagline: { color: palette.dark, textAlign: 'center', fontSize: 18, marginBottom: spacing(2) },
  onboarding: { padding: spacing(2), paddingBottom: spacing(4), maxWidth: 640, alignSelf: 'center', width: '100%' },
  onboardingCard: { flexDirection: 'row', gap: spacing(1.5), backgroundColor: palette.white, borderRadius: radii.card, padding: spacing(1.5), marginBottom: spacing(1), borderWidth: 1, borderColor: '#E3DBC9' },
  onboardingIcon: { fontSize: 42 },
  goalCard: { backgroundColor: '#EEF3E6', borderRadius: radii.card, padding: spacing(2), marginTop: spacing(1), borderWidth: 1, borderColor: '#D6DEC8' },
  primaryButton: { backgroundColor: palette.forest, borderRadius: radii.pill, minHeight: 56, alignItems: 'center', justifyContent: 'center', marginTop: spacing(2), ...shadows.soft },
  primaryButtonText: { color: palette.white, fontWeight: '900', fontSize: 17 },
  tabBar: { position: 'absolute', bottom: 18, left: 16, right: 16, maxWidth: 620, alignSelf: 'center', flexDirection: 'row', backgroundColor: 'rgba(255,253,247,0.96)', borderRadius: 34, padding: 8, borderWidth: 1, borderColor: '#E3DBC9', ...shadows.soft },
  tab: { flex: 1, alignItems: 'center', borderRadius: 26, paddingVertical: 8 },
  tabActive: { backgroundColor: '#EAF0DE' },
  tabIcon: { fontSize: 20 },
  tabLabel: { color: palette.dark, fontSize: 11, fontWeight: '700', marginTop: 2 }
});
