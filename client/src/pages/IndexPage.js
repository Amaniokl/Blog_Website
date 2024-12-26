import Post from "../Post";
import { useEffect, useState } from "react";
import { debounce } from '../utils/debounce';
// import './IndexPage.css';

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/post').then(response => {
      response.json().then(posts => {
        setPosts(posts);
      });
    });
  }, []);

  const handleSearch = async (query) => {
    if (query) {
      const response = await fetch(`http://localhost:4000/search?query=${query}`);
      const filteredPosts = await response.json();
      setPosts(filteredPosts);
    } else {
      const response = await fetch('http://localhost:4000/post');
      const allPosts = await response.json();
      setPosts(allPosts);
    }
  };

  const debouncedSearch = debounce(handleSearch, 3000);

  const handleChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  return (
    <>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={handleChange}
        />
      </div>
      {posts.length > 0 && posts.map(post => (
        <Post key={post._id} {...post} />
      ))}
    </>
  );
}