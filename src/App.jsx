import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [view, setView] = useState('posts'); // 'posts' или 'users'
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      const [usersRes, postsRes] = await Promise.all([
        axios.get('https://jsonplaceholder.typicode.com/users'),
        axios.get('https://jsonplaceholder.typicode.com/posts')
      ]);
      setUsers(usersRes.data);
      setPosts(postsRes.data);
    };
    fetchData();
  }, []);

  // Фильтрация постов (вариант 1)
  const filteredPosts = posts.filter(post => {
    const user = users.find(u => u.id === post.userId);
    return (
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Фильтрация пользователей (вариант 2)
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Посты выбранного пользователя
  const userPosts = posts.filter(post => post.userId === selectedUserId);

  return (
    <div className="app">
      <div className="controls">
        <button onClick={() => setView('posts')}>Все посты</button>
        <button onClick={() => setView('users')}>По пользователям</button>
        <input
          type="text"
          placeholder="Поиск..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {view === 'posts' ? (
        <div className="posts-grid">
          {filteredPosts.map(post => {
            const user = users.find(u => u.id === post.userId);
            return (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  {user?.name || 'Unknown'}
                </div>
                <div className="post-content">
                  <h3>{post.title}</h3>
                  <p>{post.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="users-view">
          <div className="users-list">
            {filteredUsers.map(user => (
              <div
                key={user.id}
                className={`user-card ${selectedUserId === user.id ? 'selected' : ''}`}
                onClick={() => setSelectedUserId(user.id)}
              >
                {user.name}
              </div>
            ))}
          </div>
          <div className="user-posts">
            {selectedUserId ? (
              userPosts.map(post => (
                <div key={post.id} className="post-card">
                  <h3>{post.title}</h3>
                  <p>{post.body}</p>
                </div>
              ))
            ) : (
              <p>Выберите пользователя</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;