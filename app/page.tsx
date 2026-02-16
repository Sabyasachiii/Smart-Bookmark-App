"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    getUser()
  }, [])

  async function getUser() {
    const { data } = await supabase.auth.getUser()
    if (data.user) {
      setUser(data.user)
      fetchBookmarks(data.user.id)
    }
  }

  async function fetchBookmarks(userId: string) {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) setBookmarks(data)
  }

  async function addBookmark() {
    if (!title || !url) return

    await supabase.from("bookmarks").insert([
      { title, url, user_id: user.id },
    ])

    setTitle("")
    setUrl("")
    fetchBookmarks(user.id)
  }

  async function deleteBookmark(id: string) {
    await supabase.from("bookmarks").delete().eq("id", id)
    fetchBookmarks(user.id)
  }

  async function login() {
    await supabase.auth.signInWithOAuth({ provider: "google" })
  }

  async function logout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="bg-white/20 backdrop-blur-xl p-10 rounded-3xl shadow-2xl text-center border border-white/30">
          <h1 className="text-3xl font-bold text-white mb-6">
            Smart Bookmark
          </h1>
          <button
            onClick={login}
            className="bg-white text-black px-6 py-3 rounded-xl font-medium hover:scale-105 transition"
          >
            Continue with Google
          </button>
        </div>
      </div>
    )
  }

  const filteredBookmarks = bookmarks.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-xl p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-8">Smart Bookmark</h2>

        <div className="space-y-4 text-gray-600">
          <div className="font-medium text-blue-600">Dashboard</div>
          <div>All Bookmarks</div>
          <div>Favorites</div>
          <div>Settings</div>
        </div>

        <div className="absolute bottom-6 left-6 text-sm text-gray-400">
          v1.0.0
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">

        {/* Top Bar */}
      <div className="flex justify-between items-center mb-8 
                      bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 
                      px-6 py-4 rounded-2xl shadow-lg border border-gray-700">

        <input
          type="text"
          placeholder="Search bookmarks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 px-4 py-2 bg-gray-800 text-white 
                    border border-gray-600 rounded-xl 
                    placeholder-gray-400
                    focus:ring-2 focus:ring-blue-500 
                    focus:border-blue-500 outline-none"
        />

        <div className="flex items-center gap-4">
          <img
            src={user.user_metadata.avatar_url}
            className="w-10 h-10 rounded-full border-2 border-gray-600"
          />
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg 
                      hover:bg-red-600 transition shadow-md"
          >
            Logout
          </button>
        </div>
      </div>


        {/* Add Bookmark */}
        <div className="bg-black p-6 rounded-2xl shadow mb-8">
          <h2 className="text-lg font-semibold mb-4">Add New Bookmark</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Website Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-3 rounded-lg"
            />
            <input
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="border p-3 rounded-lg"
            />
            <button
              onClick={addBookmark}
              className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Save Bookmark
            </button>
          </div>
        </div>

        {/* Bookmark Grid */}
        {filteredBookmarks.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-xl">No bookmarks yet 📌</p>
            <p className="mt-2 text-sm">
              Add your first bookmark to get started.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filteredBookmarks.map((bookmark) => {
              const domain = new URL(bookmark.url).hostname

              return (
                <div
                  key={bookmark.id}
                  className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${domain}`}
                      className="w-6 h-6"
                    />
                    <h3 className="font-semibold truncate">
                      {bookmark.title}
                    </h3>
                  </div>

                  <a
                    href={bookmark.url}
                    target="_blank"
                    className="text-sm text-blue-600 break-all"
                  >
                    {bookmark.url}
                  </a>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => deleteBookmark(bookmark.id)}
                      className="text-sm text-red-500 opacity-0 group-hover:opacity-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

