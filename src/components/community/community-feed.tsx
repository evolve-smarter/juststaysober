'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'

interface Post {
  id: string
  content: string
  category: string
  isAnon: boolean
  createdAt: Date
  user: { id: string; name: string | null; image: string | null }
  _count: { comments: number; likes: number }
}

interface Category {
  value: string
  label: string
  emoji: string
}

export function CommunityFeed({
  initialPosts,
  categories,
  currentUserId,
}: {
  initialPosts: Post[]
  categories: Category[]
  currentUserId: string | null
}) {
  const [posts, setPosts] = useState(initialPosts)
  const [activeCategory, setActiveCategory] = useState('general')
  const [newPost, setNewPost] = useState('')
  const [isAnon, setIsAnon] = useState(false)
  const [postCategory, setPostCategory] = useState('general')
  const [loading, setLoading] = useState(false)

  const filtered = activeCategory === 'general'
    ? posts
    : posts.filter((p) => p.category === activeCategory)

  async function handlePost(e: React.FormEvent) {
    e.preventDefault()
    if (!newPost.trim() || !currentUserId) return

    setLoading(true)
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPost.trim(), category: postCategory, isAnon }),
      })

      if (res.ok) {
        const post = await res.json()
        setPosts([post, ...posts])
        setNewPost('')
      }
    } finally {
      setLoading(false)
    }
  }

  const categoryEmojis: Record<string, string> = {
    general: '💬',
    milestone: '🏆',
    gratitude: '🙏',
    struggle: '💙',
    resource: '📚',
  }

  return (
    <div>
      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              activeCategory === cat.value
                ? 'bg-purple-500/30 border border-purple-500/50 text-purple-200'
                : 'bg-gray-900/60 border border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Post form */}
      {currentUserId && (
        <form onSubmit={handlePost} className="bg-gray-900/60 border border-white/10 rounded-xl p-5 mb-6">
          <textarea
            rows={3}
            placeholder="Share something... a milestone, a struggle, a word of encouragement."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none transition-colors"
          />
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <select
                value={postCategory}
                onChange={(e) => setPostCategory(e.target.value)}
                className="bg-gray-800 border border-white/10 rounded-lg px-3 py-1.5 text-gray-300 text-sm focus:outline-none"
              >
                {categories.slice(1).map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>

              <label className="flex items-center gap-2 text-gray-400 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnon}
                  onChange={(e) => setIsAnon(e.target.checked)}
                  className="rounded"
                />
                Post anonymously
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !newPost.trim()}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              {loading ? 'Posting...' : 'Share'}
            </button>
          </div>
        </form>
      )}

      {/* Posts */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-3">💬</div>
            <p>No posts yet. Be the first to share.</p>
          </div>
        )}

        {filtered.map((post) => (
          <div key={post.id} className="bg-gray-900/60 border border-white/10 rounded-xl p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {post.user.image ? (
                  <Image src={post.user.image} alt="" width={32} height={32} />
                ) : (
                  <span className="text-white text-sm font-medium">
                    {post.user.name?.[0] ?? '?'}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium text-sm">
                    {post.user.name ?? 'Anonymous'}
                  </span>
                  <span className="text-gray-600 text-xs">·</span>
                  <span className="text-gray-500 text-xs">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </span>
                  <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full ml-auto">
                    {categoryEmojis[post.category]} {post.category}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{post.content}</p>

            <div className="flex items-center gap-4 mt-4 text-gray-500 text-sm">
              <button className="flex items-center gap-1.5 hover:text-purple-400 transition-colors">
                ❤️ {post._count.likes}
              </button>
              <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                💬 {post._count.comments}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
