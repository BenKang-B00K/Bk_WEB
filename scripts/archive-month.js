/**
 * Monthly Archive Script
 * Queries Firestore for the current global ranking and inserts
 * the result into HallOfFame.tsx as a new archiveData entry.
 *
 * Runs via GitHub Actions on the last day of each month at noon KST.
 * Requires env var: FIREBASE_SERVICE_ACCOUNT (JSON string of service account key)
 */

const admin = require('firebase-admin');
const fs    = require('fs');
const path  = require('path');

// ── Guard: only run on the last day of the month ─────────────────────────────
function isLastDayOfMonth() {
  const today    = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  return tomorrow.getDate() === 1;
}

if (!isLastDayOfMonth()) {
  console.log(`Today is not the last day of the month. Skipping.`);
  process.exit(0);
}

// ── Firebase Admin init ───────────────────────────────────────────────────────
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

// ── Load game list ────────────────────────────────────────────────────────────
const games = require('../src/data/games.json');

// ── Main ──────────────────────────────────────────────────────────────────────
async function run() {
  // Build global rankings (same algorithm as GlobalLeaderboard.tsx)
  const playerPoints = {};

  await Promise.all(
    games.map(async (game) => {
      const dualSort = game.leaderboard?.dualSort ?? false;
      let q = db.collection('leaderboards').where('gameId', '==', game.id);

      q = dualSort
        ? q.orderBy('score', 'desc').orderBy('subScore', 'desc').limit(3)
        : q.orderBy('score', 'desc').limit(3);

      const snapshot = await q.get();
      snapshot.docs.forEach((doc, index) => {
        const { name } = doc.data();
        const rank   = index + 1;
        const points = rank === 1 ? 3 : rank === 2 ? 2 : 1;

        if (!playerPoints[name]) {
          playerPoints[name] = { name, totalPoints: 0 };
        }
        playerPoints[name].totalPoints += points;
      });
    })
  );

  const top3 = Object.values(playerPoints)
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, 3);

  if (top3.length === 0) {
    console.log('No leaderboard data found. Skipping archive.');
    process.exit(0);
  }

  // ── Build month label ─────────────────────────────────────────────────────
  const monthLabel = new Date().toLocaleString('en-US', {
    month: 'long',
    year:  'numeric',
    timeZone: 'Asia/Seoul',
  });

  // ── Duplicate guard ───────────────────────────────────────────────────────
  const hofPath = path.join(__dirname, '../src/pages/HallOfFame.tsx');
  let content   = fs.readFileSync(hofPath, 'utf-8');

  if (content.includes(`month: '${monthLabel}'`)) {
    console.log(`${monthLabel} is already archived. Skipping.`);
    process.exit(0);
  }

  // ── Build entry string ────────────────────────────────────────────────────
  const winnersStr = top3
    .map((p, i) => `      { rank: ${i + 1}, name: '${p.name}', score: '${p.totalPoints} pts' },`)
    .join('\n');

  const newEntry = `
  {
    month: '${monthLabel}',
    winners: [
${winnersStr}
    ],
  },`;

  // Insert at the top of archiveData (newest first)
  const MARKER = 'const archiveData: MonthlyArchive[] = [';
  content = content.replace(MARKER, MARKER + newEntry);
  fs.writeFileSync(hofPath, content, 'utf-8');

  console.log(`✅ Archived ${monthLabel}:`);
  top3.forEach((p, i) => console.log(`  ${i + 1}. ${p.name} — ${p.totalPoints} pts`));
}

run().catch((err) => {
  console.error('Archive script failed:', err);
  process.exit(1);
});
