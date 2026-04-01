'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'

interface Comment {
  id: string
  content: string
  isAnon: boolean
  createdAt: string | Date
  user: { id: string; name: string | null; image: string | null }
}

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
  likedPostIds = [],
}: {
  initialPosts: Post[]
  categories: Category[]
  currentUserId: string | null
  likedPostIds?: string[]
}) {
  const [posts, setPosts] = useState(initialPosts)
  const [likedSet, setLikedSet] = useState<Set<string>>(() => new Set(likedPostIds))
  const [activeCategory, setActiveCategory] = useState('general')
  const [newPost, setNewPost] = useState('')
  const [isAnon, setIsAnon] = useState(false)
  const [postCategory, setPostCategory] = useState('general')
  const [loading, setLoading] = useState(false)

  // Comment state per post
  const [expandedComments, setExpandedComments] = useState<Set<string>>(() => new Set())
  const [commentThreads, setCommentThreads] = useState<Record<string, Comment[]>>({})
  const [commentLoading, setCommentLoading] = useState<Record<string, boolean>>({})
  const [newComments, setNewComments] = useState<Record<string, string>>({})
  const [commentAnon, setCommentAnon] = useState<Record<string, boolean>>({})
  const [commentSubmitting, setCommentSubmitting] = useState<Record<string, boolean>>({})

  const filtered = activeCategory === 'general'
    ? posts
    : posts.filter((p) => p.category === activeCategory)

  async function handleLike(postId: string) {
    if (!currentUserId) return
    const wasLiked = likedSet.has(postId)
    setLikedSet((prev) => {
      const next = new Set(prev)
      wasLiked ? next.delete(postId) : next.add(postId)
      return next
    })
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, _count: { ...p._count, likes: p._count.likes + (wasLiked ? -1 : 1) } }
          : p
      )
    )
    try {
      await fetch(`/api/posts/${postId}/like`, { method: 'POST' })
    } catch {
      setLikedSet((prev) => {
        const next = new Set(prev)
        wasLiked ? next.add(postId) : next.delete(postId)
        return next
      })
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, _count: { ...p._count, likes: p._count.likes + (wasLiked ? 1 : -1) } }
            : p
        )
      )
    }
  }

  async function toggleComments(postId: string) {
    const isOpen = expandedComments.has(postId)
    if (isOpen) {
      setExpandedComments((prev) => {
        const next = new Set(prev)
        next.delete(postId)
        return next
      })
      return
    }
    setExpandedComments((prev) => new Set([...prev, postId]))
    if (commentThreads[postId]) return // already loaded

    setCommentLoading((prev) => ({ ...prev, [postId]: true }))
    try {
      const res = await fetch(`/api/posts/${postId}/comments`)
      if (res.ok) {
        const data: Comment[] = await res.json()
        setCommentThreads((prev) => ({ ...prev, [postId]: data }))
      }
    } finally {
      setCommentLoading((prev) => ({ ...prev, [postId]: false }))
    }
  }

  async function handleCommentSubmit(e: React.FormEvent, postId: string) {
    e.preventDefault()
    const content = newComments[postId]?.trim()
    if (!content || !currentUserId) return

    setCommentSubmitting((prev) => ({ ...prev, [postId]: true }))
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, isAnon: commentAnon[postId] ?? false }),
      })
      if (res.ok) {
        const comment: Comment = await res.json()
        setCommentThreads((prev) => ({
          ...prev,
          [postId]: [...(prev[postId] ?? []), comment],
        }))
        setNewComments((prev) => ({ ...prev, [postId]: '' }))
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, _count: { ...p._count, comments: p._count.comments + 1 } }
              : p
          )
        )
      }
    } finally {
      setCommentSubmitting((prev) => ({ ...prev, [postId]: false }))
    }
  }

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

        {filtered.map((post) => {
          const isCommentsOpen = expandedComments.has(post.id)
          const thread = commentThreads[post.id] ?? []
          const isLoadingComments = commentLoading[post.id]
          const isSubmittingComment = commentSubmitting[post.id]

          return (
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
                <button
                  onClick={() => handleLike(post.id)}
                  disabled={!currentUserId}
                  className={`flex items-center gap-1.5 transition-colors disabled:opacity-40 ${
                    likedSet.has(post.id) ? 'text-pink-400' : 'hover:text-pink-400'
                  }`}
                >
                  {likedSet.has(post.id) ? '❤️' : '🤍'} {post._count.likes}
                </button>
                <button
                  onClick={() => toggleComments(post.id)}
                  className={`flex items-center gap-1.5 transition-colors ${
                    isCommentsOpen ? 'text-blue-400' : 'hover:text-blue-400'
                  }`}
                >
                  💬 {post._count.comments}
                </button>
              </div>

              {/* Inline comment thread */}
              {isCommentsOpen && (
                <div className="mt-4 pt-4 border-t border-white/5">
                  {isLoadingComments ? (
                    <p className="text-gray-500 text-sm text-center py-3">Loading comments…</p>
                  ) : (
                    <>
                      {thread.length === 0 && (
                        <p className="text-gray-600 text-sm mb-3">No comments yet. Be the first.</p>
                      )}
                      <div className="space-y-3 mb-4">
                        {thread.map((comment) => (
                          <div key={comment.id} className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-full bg-purple-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {comment.user.image ? (
                                <Image src={comment.user.image} alt="" width={24} height={24} />
                              ) : (
                                <span className="text-white text-xs">
                                  {comment.user.name?.[0] ?? '?'}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 bg-gray-800/60 rounded-lg px-3 py-2">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-gray-300 text-xs font-medium">
                                  {comment.user.name ?? 'Anonymous'}
                                </span>
                                <span className="text-gray-600 text-xs">
                                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                </span>
                              </div>
                              <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {currentUserId && (
                        <form
                          onSubmit={(e) => handleCommentSubmit(e, post.id)}
                          className="flex items-start gap-2"
                        >
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder="Write a comment…"
                              value={newComments[post.id] ?? ''}
                              onChange={(e) =>
                                setNewComments((prev) => ({ ...prev, [post.id]: e.target.value }))
                              }
                              className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                            />
                            <label className="flex items-center gap-1.5 mt-1.5 text-gray-600 text-xs cursor-pointer">
                              <input
                                type="checkbox"
                                checked={commentAnon[post.id] ?? false}
                                onChange={(e) =>
                                  setCommentAnon((prev) => ({ ...prev, [post.id]: e.target.checked }))
                                }
                                className="rounded"
                              />
                              Anonymous
                            </label>
                          </div>
                          <button
                            type="submit"
                            disabled={isSubmittingComment || !(newComments[post.id]?.trim())}
                            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors mt-0.5"
                          >
                            {isSubmittingComment ? '…' : 'Reply'}
                          </button>
                        </form>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
