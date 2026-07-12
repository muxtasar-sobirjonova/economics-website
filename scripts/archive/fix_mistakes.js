const fs = require('fs');

let content = fs.readFileSync('components/ReviewMistakesCard.tsx', 'utf8');

// 1. Skeleton Loading Fix
// Wait, we can just change `if (loading || !userId)` to `if (loading)` 
// because if userId is null, we can still load mistakes from global state!
// Wait, the API doesn't even use userId! It just uses `state.quizResults` from `useGameState()`.
// So `userId` being null doesn't matter for fetching!
content = content.replace('if (loading || !userId) {', 'if (loading) {');

// Just in case loading somehow stays true (which it shouldn't because loadMistakesFromState is sync),
// we can also wrap loadMistakesFromState in a try/catch or just add a timeout.
// But since it's synchronous and called in useEffect, it immediately sets loading to false.
// The only reason it was hanging was `|| !userId`!

// 2. Contradictory Messaging Fix
content = content.replace(
    '{justReviewedAll ? "All done!" : "All caught up!"}',
    '{justReviewedAll ? "All done!" : "No Mistakes to Review"}'
);
content = content.replace(
    'You have zero unreviewed mistakes. You\\'re ready to tackle today\\'s agenda.',
    'You have zero unreviewed mistakes.'
);

fs.writeFileSync('components/ReviewMistakesCard.tsx', content, 'utf8');
console.log('Done ReviewMistakesCard.tsx');
