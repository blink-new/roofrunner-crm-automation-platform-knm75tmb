import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, ChevronLeft, Image, Calendar, 
  Tag, User, Globe, Clock
} from 'lucide-react';
import { Card } from '../ui/card';
import Breadcrumbs from '../Navigation/Breadcrumbs';
import { BlogService } from '../../lib/services/BlogService';

export default function BlogPostEditor() {
  const { siteId, postId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(postId) && postId !== 'new';
  
  const [post, setPost] = useState<any>({
    site_id: siteId,
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    categories: [],
    tags: [],
    status: 'draft',
    meta: {
      title: '',
      description: ''
    }
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadCategories();
    if (isEditing) {
      loadPost();
    }
  }, [siteId, postId]);

  const loadCategories = async () => {
    try {
      const data = await BlogService.getBlogCategories(siteId!);
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadPost = async () => {
    try {
      const data = await BlogService.getBlogPost(postId!);
      setPost(data);
    } catch (error) {
      console.error('Error loading post:', error);
    }
  };

  const handleSave = async (publish: boolean = false) => {
    try {
      setIsSaving(true);
      
      const postData = {
        ...post,
        status: publish ? 'published' : 'draft'
      };
      
      if (isEditing) {
        await BlogService.updateBlogPost(postId!, postData);
      } else {
        const newPost = await BlogService.createBlogPost(postData);
        navigate(`/sites/${siteId}/blog/${newPost.id}`);
      }
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    
    try {
      const slug = newCategory.toLowerCase().replace(/\s+/g, '-');
      const category = await BlogService.createBlogCategory({
        site_id: siteId!,
        name: newCategory,
        slug
      });
      
      setCategories([...categories, category]);
      setPost({
        ...post,
        categories: [...post.categories, category.id]
      });
      setNewCategory('');
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleAddTag = () => {
    if (!newTag.trim() || post.tags.includes(newTag)) return;
    
    setPost({
      ...post,
      tags: [...post.tags, newTag]
    });
    setNewTag('');
  };

  const handleRemoveTag = (tag: string) => {
    setPost({
      ...post,
      tags: post.tags.filter((t: string) => t !== tag)
    });
  };

  const generateSlug = () => {
    const slug = post.title.toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with a single one
    
    setPost({
      ...post,
      slug
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'Websites & Funnels', path: '/sites' },
              { label: 'Blog', path: `/sites/${siteId}/blog` },
              { 
                label: isEditing ? 'Edit Post' : 'New Post', 
                path: isEditing ? `/sites/${siteId}/blog/${postId}` : `/sites/${siteId}/blog/new`, 
                active: true 
              }
            ]}
          />
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => navigate(`/sites/${siteId}/blog`)}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft size={20} />
            </button>
            <h1>{isEditing ? 'Edit Post' : 'New Post'}</h1>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleSave(false)}
            className="btn btn-secondary inline-flex items-center gap-2"
            disabled={isSaving}
          >
            <Save size={16} />
            <span>Save Draft</span>
          </button>
          
          <button
            onClick={() => handleSave(true)}
            className="btn btn-primary inline-flex items-center gap-2"
            disabled={isSaving}
          >
            <Clock size={16} />
            <span>Publish</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Post Title
                </label>
                <input
                  type="text"
                  value={post.title}
                  onChange={(e) => setPost({ ...post, title: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                  placeholder="Enter post title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={post.slug}
                    onChange={(e) => setPost({ ...post, slug: e.target.value })}
                    className="flex-1 rounded-md border-gray-300"
                    placeholder="enter-post-slug"
                  />
                  <button
                    onClick={generateSlug}
                    className="btn btn-secondary"
                    disabled={!post.title}
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  value={post.content}
                  onChange={(e) => setPost({ ...post, content: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                  rows={12}
                  placeholder="Write your post content here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt
                </label>
                <textarea
                  value={post.excerpt}
                  onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                  rows={3}
                  placeholder="Brief summary of the post"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="col-span-4 space-y-6">
          <Card className="p-4">
            <h3 className="font-medium mb-3">Post Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Featured Image
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={post.featured_image || ''}
                    onChange={(e) => setPost({ ...post, featured_image: e.target.value })}
                    className="flex-1 rounded-md border-gray-300"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button className="btn btn-secondary">
                    <Image size={16} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categories
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {categories.map((category) => (
                    <label key={category.id} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={post.categories.includes(category.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPost({
                              ...post,
                              categories: [...post.categories, category.id]
                            });
                          } else {
                            setPost({
                              ...post,
                              categories: post.categories.filter((id: string) => id !== category.id)
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-primary-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-1 rounded-md border-gray-300"
                    placeholder="New category"
                  />
                  <button
                    onClick={handleAddCategory}
                    className="btn btn-secondary"
                    disabled={!newCategory.trim()}
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 rounded-md border-gray-300"
                    placeholder="Add tag"
                  />
                  <button
                    onClick={handleAddTag}
                    className="btn btn-secondary"
                    disabled={!newTag.trim()}
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author
                </label>
                <select
                  value={post.author_id || ''}
                  onChange={(e) => setPost({ ...post, author_id: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                >
                  <option value="">Select author</option>
                  <option value="current-user">Current User</option>
                </select>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium mb-3">SEO Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={post.meta.title || ''}
                  onChange={(e) => setPost({
                    ...post,
                    meta: { ...post.meta, title: e.target.value }
                  })}
                  className="w-full rounded-md border-gray-300"
                  placeholder="SEO title (defaults to post title)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  value={post.meta.description || ''}
                  onChange={(e) => setPost({
                    ...post,
                    meta: { ...post.meta, description: e.target.value }
                  })}
                  className="w-full rounded-md border-gray-300"
                  rows={3}
                  placeholder="SEO description (defaults to excerpt)"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}