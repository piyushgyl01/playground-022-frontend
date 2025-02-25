import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePost, getAllPosts } from "../features/posts/postSlice";
import { useNavigate, useParams } from "react-router-dom";

export default function EditPost() {
  const { id } = useParams();
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    image: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, status, error } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);

  // Find the post to edit
  useEffect(() => {
    if (posts.length === 0) {
      dispatch(getAllPosts());
    } else {
      const postToEdit = posts.find((post) => post._id === id);

      if (postToEdit) {
        // Check if the current user is the author
        const isAuthor =
          user &&
          (user._id === postToEdit.author ||
            user._id === postToEdit.author?._id);

        if (!isAuthor) {
          // Redirect if not the author
          navigate("/");
          return;
        }

        setPostData({
          title: postToEdit.title || "",
          content: postToEdit.content || "",
          image: postToEdit.image || "",
        });
        setIsLoading(false);
      } else {
        // Post not found
        navigate("/");
      }
    }
  }, [id, posts, user, dispatch, navigate]);

  const handleChange = (e) => {
    setPostData({
      ...postData,
      [e.target.name]: e.target.value,
    });

    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!postData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!postData.content.trim()) {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      dispatch(updatePost({ id, postData }))
        .unwrap()
        .then(() => {
          navigate("/");
        })
        .catch((err) => {
          console.error("Failed to update post:", err);
        });
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-3">
            <div className="card-header bg-white border-0 pt-4 pb-0">
              <h2 className="text-center mb-0">Edit Post</h2>
              <hr className="w-25 mx-auto mt-3" />
            </div>
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.title ? "is-invalid" : ""
                    }`}
                    id="title"
                    name="title"
                    value={postData.title}
                    onChange={handleChange}
                    placeholder="Enter post title"
                  />
                  {errors.title && (
                    <div className="invalid-feedback">{errors.title}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="image" className="form-label">
                    Image URL (optional)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="image"
                    name="image"
                    value={postData.image}
                    onChange={handleChange}
                    placeholder="Enter image URL"
                  />
                  <div className="form-text">
                    Add a link to an image to make your post more appealing
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="content" className="form-label">
                    Content
                  </label>
                  <textarea
                    className={`form-control ${
                      errors.content ? "is-invalid" : ""
                    }`}
                    id="content"
                    name="content"
                    rows="8"
                    value={postData.content}
                    onChange={handleChange}
                    placeholder="Write your post content here..."
                  ></textarea>
                  {errors.content && (
                    <div className="invalid-feedback">{errors.content}</div>
                  )}
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/")}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Updating...
                      </>
                    ) : (
                      "Update Post"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
