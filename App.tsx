import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Switch, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { HabitCard } from './src/components/HabitCard';
import { SanctuaryIllustration } from './src/components/SanctuaryIllustration';
import { addHabitAction, archiveHabitAction, blockUserAction, collectDiscoveryAction, completeExpansionAnimationAction, completeHabitAction, deleteHabitAction, editHabitAction, friendInteractionAction, markNotificationReadAction, premiumAction, removeFriendAction, scheduleHabitAction, seasonalRefreshAction, sendFriendRequestAction, skipHabitAction, toggleAccessibilityAction, toggleNotificationPreferenceAction } from './src/application/mosslightActions';
import { useMosslight } from './src/application/useMosslight';
import { ecosystemIcons, ecosystemLabels, habitCategories, notificationKinds } from './src/domain/catalog';
import { Habit, HabitDifficulty, MosslightState } from './src/domain/types';
import { activeSeasonalEvent } from './src/engines/seasonalEngine';
import { monthlyHistory, weeklyHistory } from './src/engines/habitEngine';
import { isPremium } from './src/engines/discoveryEngine';
import { todayISO } from './src/utils/date';
import { palette, radii, shadows, spacing } from './src/styles/theme';

type Tab = 'Home' | 'Sanctuary' | 'Habits' | 'Friends' | 'Profile';

const difficulties: HabitDifficulty[] = ['easy', 'medium', 'hard'];

export default function App() {
  const { state, status, error, transact, reset } = useMosslight();
  const [tab, setTab] = useState<Tab>('Home');
  const { width } = useWindowDimensions();

  if (status === 'loading' || !state) return <Shell><LoadingState message="Opening your sanctuary…" /></Shell>;
  if (status === 'error' && !state) return <Shell><ErrorState message={error ?? 'Unable to open Mosslight.'} onRetry={reset} /></Shell>;

  const seasonalEvent = activeSeasonalEvent();
  const activeHabits = state.habits.filter((habit) => habit.status === 'active');
  const completedToday = state.habitEntries.filter((entry) => entry.date === todayISO() && entry.kind === 'complete').length;
  const highContrast = state.profile.accessibility.highContrast;

  return (
    <Shell highContrast={highContrast}>
      <StatusBar barStyle="dark-content" backgroundColor={highContrast ? '#FFFFFF' : palette.cream} />
      <ScrollView contentContainerStyle={[styles.container, width < 430 && styles.compact]} showsVerticalScrollIndicator={false}>
        <Header state={state} saving={status === 'saving'} error={error} onSeason={() => transact(seasonalRefreshAction)} />
        {tab === 'Home' && <HomeScreen state={state} activeHabits={activeHabits} completedToday={completedToday} seasonalEvent={seasonalEvent} transact={transact} />}
        {tab === 'Sanctuary' && <SanctuaryScreen state={state} seasonalEvent={seasonalEvent} transact={transact} />}
        {tab === 'Habits' && <HabitsScreen state={state} transact={transact} />}
        {tab === 'Friends' && <FriendsScreen state={state} transact={transact} />}
        {tab === 'Profile' && <ProfileScreen state={state} transact={transact} reset={reset} />}
      </ScrollView>
      <TabBar active={tab} onChange={setTab} />
    </Shell>
  );
}

function Shell({ children, highContrast }: { children: React.ReactNode; highContrast?: boolean }) {
  return <SafeAreaView style={[styles.safe, highContrast && styles.highContrast]}>{children}</SafeAreaView>;
}

function Header({ state, saving, error, onSeason }: { state: MosslightState; saving: boolean; error?: string; onSeason: () => void }) {
  const unread = state.notifications.filter((notification) => !notification.read).length;
  return (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.kicker, state.profile.accessibility.largeText && styles.largeText]}>☀️ Good morning, {state.profile.displayName}</Text>
        <Text style={styles.subtle}>{state.profile.sanctuaryName} • Lv. {state.profile.sanctuaryLevel} • {state.profile.sanctuaryXp} XP</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
      {saving ? <ActivityIndicator color={palette.forest} /> : <Pressable style={styles.notification} onPress={onSeason} accessibilityRole="button" accessibilityLabel={`${unread} unread notifications`}> <Text>🔔 {unread}</Text></Pressable>}
    </View>
  );
}

function HomeScreen({ state, activeHabits, completedToday, seasonalEvent, transact }: { state: MosslightState; activeHabits: Habit[]; completedToday: number; seasonalEvent: ReturnType<typeof activeSeasonalEvent>; transact: (updater: (state: MosslightState) => MosslightState) => void }) {
  const nextExpansion = state.expansions.find((area) => !area.owned);
  const recentDiscovery = state.discoveries[0];
  return (
    <>
      <View style={styles.statsRow}>
        <Stat icon="⭐" value={String(state.profile.currentStreak)} label="Day streak" />
        <Stat icon="🌿" value={`Lv. ${state.profile.sanctuaryLevel}`} label="Sanctuary" />
        <Stat icon="🫧" value={`${completedToday}/${activeHabits.length}`} label="Nurtured" />
      </View>
      <SanctuaryIllustration ecosystems={state.ecosystems} expansions={state.expansions} seasonalEvent={seasonalEvent} reducedMotion={state.profile.accessibility.reducedMotion} />
      <SectionHeader title="Today’s nurturing" action={activeHabits.length ? 'Persisted locally' : 'Add your first habit'} />
      {activeHabits.length ? activeHabits.slice(0, 4).map((habit) => <HabitCard key={habit.id} habit={habit} entries={state.habitEntries} onComplete={(item) => transact((current) => completeHabitAction(current, item.id))} onSkip={(item) => transact((current) => skipHabitAction(current, item.id))} onEdit={(item) => transact((current) => editHabitAction(current, item.id, { title: `${item.title} ✎` }))} onArchive={(item) => transact((current) => archiveHabitAction(current, item.id))} />) : <EmptyState title="No active habits yet" body="Create one nurturing ritual to begin growing your sanctuary." />}
      <View style={styles.discoveryCard}>
        <Text style={styles.discoveryTitle}>Sanctuary pulse</Text>
        <Text style={styles.discoveryName}>{recentDiscovery ? `✨ ${recentDiscovery.name}` : '🌱 No rare discoveries yet'}</Text>
        <Text style={styles.subtle}>{isPremium(state.profile.premiumUntil) ? 'Premium discovery encounters are active.' : 'Rare discovery encounters unlock with Premium.'} Next expansion: {nextExpansion?.name ?? 'Living Paradise complete'}.</Text>
      </View>
    </>
  );
}

function SanctuaryScreen({ state, seasonalEvent, transact }: { state: MosslightState; seasonalEvent: ReturnType<typeof activeSeasonalEvent>; transact: (updater: (state: MosslightState) => MosslightState) => void }) {
  return (
    <View>
      <SectionHeader title="Sanctuary map" action={seasonalEvent.title} />
      <SanctuaryIllustration ecosystems={state.ecosystems} expansions={state.expansions} seasonalEvent={seasonalEvent} reducedMotion={state.profile.accessibility.reducedMotion} />
      <Text style={styles.bodyCopy}>The sanctuary is calculated from persisted habit completions. XP updates levels, levels unlock ecosystem rewards, and expansion fog clears at sanctuary milestones.</Text>
      {Object.values(state.ecosystems).map((ecosystem) => <View key={ecosystem.id} style={styles.card}><Text style={styles.cardTitle}>{ecosystemIcons[ecosystem.id]} {ecosystemLabels[ecosystem.id]} • Level {ecosystem.level}</Text><Text style={styles.subtle}>{ecosystem.xp} XP • Unlocks: {ecosystem.unlocks.map((unlock) => unlock.name).join(', ')}</Text><Text style={styles.subtle}>Decorations {ecosystem.decorations.length} • Discoveries {ecosystem.discoveries.length} • Gentle neglect {ecosystem.gentleNeglectScore}</Text></View>)}
      <SectionHeader title="Land expansions" action="Fog of discovery" />
      {state.expansions.map((area) => <View key={area.id} style={styles.rowCard}><View style={{ flex: 1 }}><Text style={styles.cardTitle}>{area.owned ? '🌿' : '🌫️'} {area.name}</Text><Text style={styles.subtle}>Level {area.levelRequired} • {area.fogState} • Rewards: {area.rewards.join(', ')}</Text></View>{area.animationState === 'queued' ? <Pill label="Reveal" onPress={() => transact((current) => completeExpansionAnimationAction(current, area.id))} /> : null}</View>)}
    </View>
  );
}

function HabitsScreen({ state, transact }: { state: MosslightState; transact: (updater: (state: MosslightState) => MosslightState) => void }) {
  const [title, setTitle] = useState('');
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [difficultyIndex, setDifficultyIndex] = useState(0);
  const [target, setTarget] = useState('1 session');
  const category = habitCategories[categoryIndex];
  const weekly = useMemo(() => weeklyHistory(state.habitEntries), [state.habitEntries]);
  const monthly = useMemo(() => monthlyHistory(state.habitEntries), [state.habitEntries]);
  return (
    <View>
      <SectionHeader title="Habit engine" action="Create • edit • schedule" />
      <View style={styles.formCard}>
        <TextInput value={title} onChangeText={setTitle} placeholder="Habit name" placeholderTextColor="#7A8178" style={styles.input} accessibilityLabel="Habit name" />
        <TextInput value={target} onChangeText={setTarget} placeholder="Target label" placeholderTextColor="#7A8178" style={styles.input} accessibilityLabel="Habit target" />
        <View style={styles.actions}><Pill label={`${category.label} ${ecosystemIcons[category.ecosystemId]}`} onPress={() => setCategoryIndex((categoryIndex + 1) % habitCategories.length)} /><Pill label={difficulties[difficultyIndex]} onPress={() => setDifficultyIndex((difficultyIndex + 1) % difficulties.length)} /><Pill label="Add Habit" onPress={() => { if (title.trim()) { transact((current) => addHabitAction(current, { title, category: category.label, ecosystemId: category.ecosystemId, difficulty: difficulties[difficultyIndex], targetLabel: target, reminderTime: '08:00' })); setTitle(''); } }} /></View>
      </View>
      {state.habits.filter((habit) => habit.status !== 'deleted').map((habit) => <HabitCard key={habit.id} habit={habit} entries={state.habitEntries} onComplete={(item) => transact((current) => completeHabitAction(current, item.id))} onSkip={(item) => transact((current) => skipHabitAction(current, item.id))} onEdit={(item) => transact((current) => editHabitAction(current, item.id, { targetLabel: item.targetLabel === '1 session' ? '10 minutes' : '1 session' }))} onArchive={(item) => transact((current) => item.status === 'archived' ? deleteHabitAction(current, item.id) : archiveHabitAction(current, item.id))} />)}
      <View style={styles.card}><Text style={styles.cardTitle}>Weekly history</Text><Text style={styles.pageList}>{weekly.map((day) => `${day.date.slice(5)}: ${day.completed} done/${day.skipped} skip/${day.growth} XP`).join(' • ')}</Text></View>
      <View style={styles.card}><Text style={styles.cardTitle}>Monthly history</Text><Text style={styles.pageList}>{monthly.map((week) => `${week.weekStart.slice(5)}: ${week.completed} done, ${week.growth} XP`).join(' • ')}</Text></View>
      {state.habits.length === 0 ? <EmptyState title="No habits" body="Add a habit and choose the ecosystem it should nurture." /> : null}
    </View>
  );
}

function FriendsScreen({ state, transact }: { state: MosslightState; transact: (updater: (state: MosslightState) => MosslightState) => void }) {
  const [friendId, setFriendId] = useState('');
  return <View><SectionHeader title="Friends" action="No leaderboards" /><TextInput value={friendId} onChangeText={setFriendId} placeholder="Friend user id" placeholderTextColor="#7A8178" style={styles.input} accessibilityLabel="Friend user id" /><Pill label="Send Friend Request" onPress={() => { if (friendId.trim()) transact((current) => sendFriendRequestAction(current, friendId.trim())); }} />{state.friends.length === 0 ? <EmptyState title="No friends yet" body="Send a request to visit sanctuaries and share gentle boosts." /> : state.friends.map((friend) => <View key={friend.id} style={styles.rowCard}><Text style={styles.friendAvatar}>{friend.avatarEmoji}</Text><View style={{ flex: 1 }}><Text style={styles.cardTitle}>{friend.displayName}</Text><Text style={styles.subtle}>{friend.sanctuaryName}</Text></View><Pill label="Visit" onPress={() => transact((current) => friendInteractionAction(current, friend.id, 'visit', `Visited ${friend.sanctuaryName}.`))} /><Pill label="Water" onPress={() => transact((current) => friendInteractionAction(current, friend.id, 'water_drop', 'Left a water drop.'))} /><Pill label="Remove" quiet onPress={() => transact((current) => removeFriendAction(current, friend.id))} /><Pill label="Block" quiet onPress={() => transact((current) => blockUserAction(current, friend.id))} /></View>)}<SectionHeader title="Requests" action={`${state.friendRequests.length}`} />{state.friendRequests.map((request) => <View key={request.id} style={styles.card}><Text style={styles.cardTitle}>{request.status} request</Text><Text style={styles.subtle}>{request.requesterId} → {request.addresseeId}</Text></View>)}<SectionHeader title="Recent activity" action={`${state.friendActivities.length}`} />{state.friendActivities.map((activity) => <Text key={activity.id} style={styles.pageList}>• {activity.message}</Text>)}</View>;
}

function ProfileScreen({ state, transact, reset }: { state: MosslightState; transact: (updater: (state: MosslightState) => MosslightState) => void; reset: () => void }) {
  return <View><SectionHeader title="Profile & settings" action={isPremium(state.profile.premiumUntil) ? 'Premium active' : '$6.99/mo'} /><View style={styles.profileCard}><Text style={styles.logo}>Mosslight</Text><Text style={styles.bodyCopy}>Cloud sync schema, offline persistence, notification preferences, accessibility controls, premium discoveries, seasonal content, and sanctuary progression are now separated into data, business, and UI layers.</Text><Pill label={isPremium(state.profile.premiumUntil) ? 'Premium Active' : 'Activate Premium'} onPress={() => transact(premiumAction)} /></View><SectionHeader title="Discoveries" action={`${state.discoveries.length}`} />{state.discoveries.length === 0 ? <EmptyState title="No discoveries collected" body="Premium users can encounter rare discoveries when completing habits." /> : state.discoveries.map((discovery) => <View key={discovery.id} style={styles.rowCard}><View style={{ flex: 1 }}><Text style={styles.cardTitle}>✨ {discovery.name}</Text><Text style={styles.subtle}>{discovery.rarity} • {discovery.artworkRef} • Replay {discovery.replayToken}</Text></View>{discovery.collectedAt ? <Text style={styles.subtle}>Collected</Text> : <Pill label="Collect" onPress={() => transact((current) => collectDiscoveryAction(current, discovery.id))} />}</View>)}<SectionHeader title="Notifications" action="Preferences" />{notificationKinds.map((kind) => <ToggleRow key={kind} label={kind.replace(/_/g, ' ')} value={state.profile.notificationPreferences.find((item) => item.kind === kind)?.enabled ?? true} onValueChange={() => transact((current) => toggleNotificationPreferenceAction(current, kind))} />)}{state.notifications.slice(0, 6).map((notification) => <Pressable key={notification.id} style={styles.card} onPress={() => transact((current) => markNotificationReadAction(current, notification.id))}><Text style={styles.cardTitle}>{notification.read ? '✓' : '•'} {notification.title}</Text><Text style={styles.subtle}>{notification.body}</Text></Pressable>)}<SectionHeader title="Accessibility" action="Audit controls" />{Object.keys(state.profile.accessibility).map((key) => <ToggleRow key={key} label={key.replace(/([A-Z])/g, ' $1')} value={state.profile.accessibility[key as keyof typeof state.profile.accessibility]} onValueChange={() => transact((current) => toggleAccessibilityAction(current, key as keyof typeof state.profile.accessibility))} />)}<Pill label="Reset local sanctuary" quiet onPress={reset} /></View>;
}

function Stat({ icon, value, label }: { icon: string; value: string; label: string }) { return <View style={styles.statCard}><Text style={styles.statIcon}>{icon}</Text><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>; }
function SectionHeader({ title, action }: { title: string; action: string }) { return <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{title}</Text><Text style={styles.sectionAction}>{action}</Text></View>; }
function Pill({ label, onPress, quiet }: { label: string; onPress: () => void; quiet?: boolean }) { return <Pressable style={[styles.pill, quiet && styles.quietPill]} onPress={onPress} accessibilityRole="button"><Text style={[styles.pillText, quiet && styles.quietPillText]}>{label}</Text></Pressable>; }
function ToggleRow({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: () => void }) { return <View style={styles.toggleRow}><Text style={styles.cardTitle}>{label}</Text><Switch value={value} onValueChange={onValueChange} accessibilityLabel={label} /></View>; }
function LoadingState({ message }: { message: string }) { return <View style={styles.center}><ActivityIndicator color={palette.forest} /><Text style={styles.bodyCopy}>{message}</Text></View>; }
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) { return <View style={styles.center}><Text style={styles.errorText}>{message}</Text><Pill label="Retry" onPress={onRetry} /></View>; }
function EmptyState({ title, body }: { title: string; body: string }) { return <View style={styles.empty}><Text style={styles.cardTitle}>{title}</Text><Text style={styles.subtle}>{body}</Text></View>; }

function TabBar({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  const tabs: Array<{ id: Tab; icon: string }> = [{ id: 'Home', icon: '⌂' }, { id: 'Sanctuary', icon: '🗺️' }, { id: 'Habits', icon: '✓' }, { id: 'Friends', icon: '👥' }, { id: 'Profile', icon: '♡' }];
  return <View style={styles.tabBar}>{tabs.map((item) => <Pressable key={item.id} onPress={() => onChange(item.id)} style={[styles.tab, active === item.id && styles.tabActive]} accessibilityRole="tab" accessibilityState={{ selected: active === item.id }}><Text style={styles.tabIcon}>{item.icon}</Text><Text style={styles.tabLabel}>{item.id}</Text></Pressable>)}</View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.cream },
  highContrast: { backgroundColor: '#FFFFFF' },
  container: { padding: spacing(2), paddingBottom: 112, maxWidth: 680, alignSelf: 'center', width: '100%' },
  compact: { paddingHorizontal: spacing(1.5) },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing(3) },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing(1), gap: spacing(1) },
  kicker: { color: palette.dark, fontSize: 22, fontWeight: '900' },
  largeText: { fontSize: 28 },
  subtle: { color: palette.dark, opacity: 0.66, lineHeight: 20 },
  errorText: { color: '#A23B34', fontWeight: '800', marginTop: 4 },
  notification: { minWidth: 58, height: 44, borderRadius: 22, backgroundColor: palette.white, alignItems: 'center', justifyContent: 'center', ...shadows.soft },
  statsRow: { flexDirection: 'row', gap: spacing(1), marginTop: spacing(2) },
  statCard: { flex: 1, backgroundColor: palette.white, borderRadius: radii.card, padding: spacing(1.25), borderWidth: 1, borderColor: '#E3DBC9' },
  statIcon: { fontSize: 20 },
  statValue: { color: palette.dark, fontWeight: '900', fontSize: 18, marginTop: 4 },
  statLabel: { color: palette.dark, opacity: 0.62, fontSize: 11 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: spacing(1) },
  sectionTitle: { color: palette.dark, fontSize: 19, fontWeight: '900' },
  sectionAction: { color: palette.forest, fontSize: 12, fontWeight: '800' },
  bodyCopy: { color: palette.dark, opacity: 0.76, lineHeight: 22, marginBottom: spacing(1.5) },
  card: { backgroundColor: palette.white, borderRadius: radii.card, padding: spacing(1.5), marginBottom: spacing(1), borderWidth: 1, borderColor: '#E3DBC9', ...shadows.soft },
  rowCard: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing(1), backgroundColor: palette.white, borderRadius: radii.card, padding: spacing(1.25), marginBottom: spacing(1), borderWidth: 1, borderColor: '#E3DBC9' },
  formCard: { backgroundColor: '#EEF3E6', borderRadius: radii.card, padding: spacing(1.5), marginBottom: spacing(1), borderWidth: 1, borderColor: '#D6DEC8' },
  input: { backgroundColor: palette.white, borderRadius: radii.soft, borderWidth: 1, borderColor: '#E3DBC9', minHeight: 48, paddingHorizontal: spacing(1.5), marginBottom: spacing(1), color: palette.dark },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing(0.75), marginTop: spacing(0.5) },
  cardTitle: { color: palette.dark, fontWeight: '900', fontSize: 16, marginBottom: 4, textTransform: 'capitalize' },
  pageList: { color: palette.dark, opacity: 0.74, lineHeight: 23 },
  discoveryCard: { backgroundColor: '#FFF6E0', borderRadius: radii.card, padding: spacing(2), borderWidth: 1, borderColor: '#EEDDAF', marginTop: spacing(1), ...shadows.soft },
  discoveryTitle: { color: palette.dark, fontWeight: '700', opacity: 0.68 },
  discoveryName: { color: palette.dark, fontSize: 23, fontWeight: '900', marginVertical: spacing(0.5) },
  empty: { alignItems: 'center', backgroundColor: '#F8F1E5', borderRadius: radii.card, padding: spacing(2), marginBottom: spacing(1), borderWidth: 1, borderColor: '#E3DBC9' },
  pill: { backgroundColor: palette.forest, borderRadius: radii.pill, paddingHorizontal: spacing(1.5), paddingVertical: spacing(0.9), alignSelf: 'flex-start', marginBottom: 4 },
  quietPill: { backgroundColor: '#EEF3E6' },
  pillText: { color: palette.white, fontWeight: '900', fontSize: 12 },
  quietPillText: { color: palette.forest },
  friendAvatar: { fontSize: 30 },
  profileCard: { backgroundColor: palette.white, borderRadius: radii.card, padding: spacing(2), borderWidth: 1, borderColor: '#E3DBC9', marginBottom: spacing(1) },
  logo: { color: palette.forest, fontSize: 46, fontWeight: '900', letterSpacing: -2, textAlign: 'center' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: palette.white, borderRadius: radii.card, padding: spacing(1.25), marginBottom: spacing(1), borderWidth: 1, borderColor: '#E3DBC9' },
  tabBar: { position: 'absolute', bottom: 18, left: 16, right: 16, maxWidth: 660, alignSelf: 'center', flexDirection: 'row', backgroundColor: 'rgba(255,253,247,0.96)', borderRadius: 34, padding: 8, borderWidth: 1, borderColor: '#E3DBC9', ...shadows.soft },
  tab: { flex: 1, alignItems: 'center', borderRadius: 26, paddingVertical: 8 },
  tabActive: { backgroundColor: '#EAF0DE' },
  tabIcon: { fontSize: 20 },
  tabLabel: { color: palette.dark, fontSize: 11, fontWeight: '700', marginTop: 2 }
});
