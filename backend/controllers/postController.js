const api = require('../services/apiService');

const getPosts = async (req, res) => {
    try {
        const { type } = req.query;

        // Fetch users to get their post details
        const response = await api.get('/users');
        const users = response.data.users;

        let allPosts = [];

        // Fetch all posts for each user
        for (const userId in users) {
            const posts = await api.get(`/users/${userId}/posts`);
            allPosts = [...allPosts, ...posts.data.posts];
        }

        if (type === 'popular') {
            // Fetch comment counts for each post
            const commentCounts = await Promise.all(
                allPosts.map(async (post) => {
                    const comments = await api.get(`/posts/${post.id}/comments`);
                    return { 
                        ...post, 
                        commentCount: comments.data.comments.length 
                    };
                })
            );

            // Get maximum comment count
            const maxComments = Math.max(...commentCounts.map(post => post.commentCount));
            
            // Get all posts with the highest comment count
            const topPosts = commentCounts.filter(post => post.commentCount === maxComments);
            res.json(topPosts);

        } else if (type === 'latest') {
            // Sort posts by ID (assuming higher ID = latest post)
            allPosts.sort((a, b) => b.id - a.id);
            const latestPosts = allPosts.slice(0, 5);
            res.json(latestPosts);
        } else {
            res.status(400).json({ message: "Invalid type parameter" });
        }
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        res.status(500).json({ message: 'Error fetching posts' });
    }
};

module.exports = { getPosts };
