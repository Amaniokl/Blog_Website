import {useContext, useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";
import {formatISO9075} from "date-fns";
import {UserContext} from "../UserContext";
// import './PostPage.css'; // Adjust the path as necessary

export default function PostPage() {
  const [postInfo,setPostInfo] = useState(null);
  const {userInfo} = useContext(UserContext);
  const {id} = useParams();

  useEffect(() => {
    fetch(`http://localhost:4000/post/${id}`)
      .then(response => {
        response.json().then(postInfo => {
          setPostInfo(postInfo);
        });
      });
  }, [id]);

  const handleDelete = async () => {
    const response = await fetch(`http://localhost:4000/post/${id}`, {
      method: 'DELETE',
      credentials: 'include', // Include cookies for authentication
    });
    if (response.ok) {
      alert('Post deleted successfully');
      // Redirect to the home page or update the state to remove the post
      window.location.href = '/'; // Redirect to home page
    } else {
      alert('Failed to delete the post');
    }
  };

  if (!postInfo) return '';

  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
      <div className="author">by @{postInfo.author.username}</div>
      {userInfo.id === postInfo.author._id && (
        <div className="edit-row">
          <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
            Edit
          </Link>
          <button onClick={handleDelete} className="delete-btn">
            Delete
          </button>
        </div>
      )}
      <div className="image">
        <img src={`http://localhost:4000/${postInfo.cover}`} alt=""/>
      </div>
      <div className="content" dangerouslySetInnerHTML={{__html:postInfo.content}} />
    </div>
  );
}