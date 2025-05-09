import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Image, Send, Trash2, Edit2, Plus } from 'lucide-react';
import { Card } from '../ui/card';
import { SocialService } from '../../lib/services/SocialService';

export default function SocialPlanner() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    platform: [] as string[],
    scheduled_at: '',
    media_urls: [] as string[]
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await SocialService.getSocialPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error loading social posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    try {
      await SocialService.createSocialPost(newPost);
      setNewPost({
        content: '',
        platform: [],
        scheduled_at: '',
        media_urls: []
      });
      setShowNewPost(false);
      loadPosts();
    } catch (error) {
      console.error('Error creating social post:', error);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await SocialService.deleteSocialPost(id);
        loadPosts();
      } catch (error) {
        console.error('Error deleting social post:', error);
      }
    }
  };

  const handlePublishNow = async (id: string) => {
    try {
      await SocialService.publishNow(id);
      loadPosts();
    } catch (error) {
      console.error('Error publishing post:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Social Media Planner</h1>
        <button
          onClick={() => setShowNewPost(true)}
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <Plus size={16} />
          <span>New Post</span>
        </button>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {showNewPost && (
            <div className="border rounded-lg p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Post Content
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                  rows={3}
                  placeholder="What would you like to share?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platforms
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map(platform => (
                    <label key={platform} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={newPost.platform.includes(platform.toLowerCase())}
                        onChange={(e) => {
                          const platform_lower = platform.toLowerCase();
                          if (e.target.checked) {
                            setNewPost({
                              ...newPost,
                              platform: [...newPost.platform, platform_lower]
                            });
                          } else {
                            setNewPost({
                              ...newPost,
                              platform: newPost.platform.filter(p => p !== platform_lower)
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-primary-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule
                </label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        value={newPost.scheduled_at.split('T')[0] || ''}
                        onChange={(e) => {
                          const time = newPost.scheduled_at.split('T')[1] || '12:00';
                          setNewPost({
                            ...newPost,
                            scheduled_at: `${e.target.value}T${time}`
                          });
                        }}
                        className="w-full pl-10 rounded-md border-gray-300"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <Clock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="time"
                        value={newPost.scheduled_at.split('T')[1]?.substring(0, 5) || ''}
                        onChange={(e) => {
                          const date = newPost.scheduled_at.split('T')[0] || new Date().toISOString().split('T')[0];
                          setNewPost({
                            ...newPost,
                            scheduled_at: `${date}T${e.target.value}:00`
                          });
                        }}
                        className="w-full pl-10 rounded-md border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Media
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Image size={24} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    Drag and drop images here, or click to select
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowNewPost(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  className="btn btn-primary"
                  disabled={!newPost.content || newPost.platform.length === 0}
                >
                  {newPost.scheduled_at ? 'Schedule Post' : 'Post Now'}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-lg font-medium">Scheduled Posts</h2>
            {loading ? (
              <div className="text-center py-4">Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No scheduled posts found
              </div>
            ) : (
              posts.map(post => (
                <div key={post.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {post.platform.map((p: string) => (
                          <div
                            key={p}
                            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center -ml-1 first:ml-0"
                            title={p}
                          >
                            {p[0].toUpperCase()}
                          </div>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {post.status === 'published' ? 'Published' : 'Scheduled'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handlePublishNow(post.id)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Publish now"
                      >
                        <Send size={14} />
                      </button>
                      <button
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Edit post"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Delete post"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm mb-2">{post.content}</p>
                  {post.scheduled_at && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar size={12} />
                      <span>{new Date(post.scheduled_at).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}