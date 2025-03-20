const api = require('../services/apiService');

const getTopUsers = async (req, res) => {
    try {
        // Fetch all users
        const response = await api.get('/users');
        const users = response.data.users;

        // Create array to hold user post counts
        const postCounts = await Promise.all(
            Object.keys(users).map(async (userId) => {
                // Fetch posts for each user
                const posts = await api.get(`/users/${userId}/posts`);
                return { 
                    userId, 
                    userName: users[userId], 
                    postCount: posts.data.posts.length 
                };
            })
        );

        // Sort by post count (descending) and get top 5
        postCounts.sort((a, b) => b.postCount - a.postCount);
        const topUsers = postCounts.slice(0, 5);

        res.json(topUsers);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

module.exports = { getTopUsers };
