const CATEGORIES_KEY = 'aquamc_categories';

function getCategories() {
  return JSON.parse(localStorage.getItem(CATEGORIES_KEY) || '[]');
}

function saveCategories(cats) {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(cats));
}

function createCategory(name, description, allowReplies, allowTopics) {
  const cats = getCategories();
  const newCat = {
    id: Date.now(),
    name,
    description,
    createdAt: new Date().toISOString(),
    allowReplies: allowReplies !== undefined ? allowReplies : true,
    allowTopics: allowTopics !== undefined ? allowTopics : true,
    topics: []
  };
  cats.push(newCat);
  saveCategories(cats);
  return newCat;
}

function updateCategory(catId, updates) {
  const cats = getCategories();
  const cat = cats.find(c => c.id == catId);
  if (!cat) return null;
  Object.assign(cat, updates);
  saveCategories(cats);
  return cat;
}

function deleteCategory(catId) {
  let cats = getCategories();
  cats = cats.filter(c => c.id != catId);
  saveCategories(cats);
}

function createTopic(catId, title, content, author, prefix, imageData) {
  const cats = getCategories();
  const cat = cats.find(c => c.id == catId);
  if (!cat) return null;
  const newTopic = {
    id: Date.now(),
    title,
    content,
    author,
    prefix: prefix || '',
    image: imageData || null,
    createdAt: new Date().toISOString(),
    locked: false,
    pinned: false,
    replies: []
  };
  cat.topics.unshift(newTopic);
  saveCategories(cats);
  return newTopic;
}

function updateTopic(catId, topicId, updates) {
  const cats = getCategories();
  const cat = cats.find(c => c.id == catId);
  if (!cat) return null;
  const topic = cat.topics.find(t => t.id == topicId);
  if (!topic) return null;
  Object.assign(topic, updates);
  saveCategories(cats);
  return topic;
}

function deleteTopic(catId, topicId) {
  const cats = getCategories();
  const cat = cats.find(c => c.id == catId);
  if (!cat) return;
  cat.topics = cat.topics.filter(t => t.id != topicId);
  saveCategories(cats);
}

function getTopicById(catId, topicId) {
  const cats = getCategories();
  const cat = cats.find(c => c.id == catId);
  if (!cat) return null;
  return cat.topics.find(t => t.id == topicId) || null;
}

function addReply(catId, topicId, content, author, imageData) {
  const cats = getCategories();
  const cat = cats.find(c => c.id == catId);
  if (!cat) return null;
  const topic = cat.topics.find(t => t.id == topicId);
  if (!topic) return null;
  if (topic.locked) return null;
  const reply = {
    id: Date.now(),
    content,
    author,
    image: imageData || null,
    createdAt: new Date().toISOString()
  };
  topic.replies.push(reply);
  saveCategories(cats);
  return reply;
}

function deleteReply(catId, topicId, replyId) {
  const cats = getCategories();
  const cat = cats.find(c => c.id == catId);
  if (!cat) return;
  const topic = cat.topics.find(t => t.id == topicId);
  if (!topic) return;
  topic.replies = topic.replies.filter(r => r.id != replyId);
  saveCategories(cats);
}

function getCategoryById(id) {
  return getCategories().find(c => c.id == id);
}

function getPrefixLabel(prefix) {
  const labels = {
    'approved': 'Одобрено',
    'solved': 'Решено',
    'rejected': 'Отклонено',
    'pending': 'На рассмотрении',
    'important': 'Важно'
  };
  return labels[prefix] || '';
}

function getPrefixClass(prefix) {
  const classes = {
    'approved': 'prefix-approved',
    'solved': 'prefix-solved',
    'rejected': 'prefix-rejected',
    'pending': 'prefix-pending',
    'important': 'prefix-important'
  };
  return classes[prefix] || '';
}
