const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  try {
    console.log("Authorization Header:", `Bearer ${process.env.ACCESS_TOKEN}`);

    const response = await axios.get(`${process.env.TEST_SERVER_URL}/users`, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
      },
    });

    console.log("Users fetched:", response.data);

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

module.exports = router;
