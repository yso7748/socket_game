const userItems = {};

export const initializeItems = (userId) => {
  userItems[userId] = [];
};

export const addItem = (userId, item) => {
  if (!userItems[userId]) {
    userItems[userId] = [];
  }
  userItems[userId].push(item);
};

export const getUserItems = (userId) => {
  return userItems[userId] || [];
};
