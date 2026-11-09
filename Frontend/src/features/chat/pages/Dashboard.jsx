import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { ArrowUp, Check, Copy, Menu, MoreHorizontal, PanelLeft, Plus, Search, Sparkles } from 'lucide-react'
import { useAuth } from '../../auth/hooks/useAuth.js'
import { useChat } from '../hooks/useChat.js'

const idOf = (chat) => chat?._id
const textOf = (message) => message?.content || message?.message || ''

const renderInlineMarkdown = (value) => {
    const tokenPattern = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\*[^*]+\*|_[^_]+_)/g
    return value.split(tokenPattern).filter(Boolean).map((token, index) => {
        if (token.startsWith('**') && token.endsWith('**') || token.startsWith('__') && token.endsWith('__')) return <strong key={index}>{token.slice(2, -2)}</strong>
        if (token.startsWith('*') && token.endsWith('*') || token.startsWith('_') && token.endsWith('_')) return <em key={index}>{token.slice(1, -1)}</em>
        if (token.startsWith('`') && token.endsWith('`')) return <code key={index} className="rounded bg-zinc-800 px-1.5 py-0.5 text-[0.9em] text-amber-200">{token.slice(1, -1)}</code>
        if (token.startsWith('[')) {
            const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
            if (link && /^https?:\/\//i.test(link[2])) return <a key={index} href={link[2]} target="_blank" rel="noreferrer" className="text-blue-400 underline underline-offset-2 hover:text-blue-300">{link[1]}</a>
        }
        return <span key={index}>{token}</span>
    })
}

function MarkdownResponse({ content }) {
    const lines = String(content).replace(/\r\n?/g, '\n').split('\n')
    const blocks = []
    let paragraph = []
    let list = null
    let code = null

    const flushParagraph = () => {
        if (paragraph.length) blocks.push(<p key={`p-${blocks.length}`}>{renderInlineMarkdown(paragraph.join(' '))}</p>)
        paragraph = []
    }
    const flushList = () => {
        if (!list) return
        const ListTag = list.type === 'ordered' ? 'ol' : 'ul'
        blocks.push(<ListTag key={`list-${blocks.length}`} className="my-2 space-y-1 pl-5">{list.items.map((item, index) => <li key={index}>{renderInlineMarkdown(item)}</li>)}</ListTag>)
        list = null
    }

    lines.forEach((line) => {
        const fence = line.match(/^\s*```(.*)$/)
        if (fence && !code) { flushParagraph(); flushList(); code = { language: fence[1].trim(), lines: [] }; return }
        if (code) {
            if (line.trim() === '```') {
                blocks.push(<pre key={`code-${blocks.length}`} className="my-3 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs leading-relaxed text-zinc-300"><code className={code.language ? `language-${code.language}` : undefined}>{code.lines.join('\n')}</code></pre>)
                code = null
            } else code.lines.push(line)
            return
        }

        const heading = line.match(/^\s*(#{1,6})\s+(.+?)\s*#*\s*$/)
        const unordered = line.match(/^\s*[-*+]\s+(.+)$/)
        const ordered = line.match(/^\s*\d+[.)]\s+(.+)$/)
        if (!line.trim()) { flushParagraph(); flushList(); return }
        if (heading) { flushParagraph(); flushList(); const Tag = `h${heading[1].length}`; blocks.push(<Tag key={`heading-${blocks.length}`} className="mt-4 mb-2 text-base font-semibold text-zinc-100 first:mt-0">{renderInlineMarkdown(heading[2])}</Tag>); return }
        if (unordered || ordered) {
            flushParagraph()
            const type = unordered ? 'unordered' : 'ordered'
            if (!list || list.type !== type) { flushList(); list = { type, items: [] } }
            list.items.push((unordered || ordered)[1])
            return
        }
        flushList()
        paragraph.push(line.trim())
    })

    if (code) blocks.push(<pre key={`code-${blocks.length}`} className="my-3 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs leading-relaxed text-zinc-300"><code>{code.lines.join('\n')}</code></pre>)
    flushParagraph()
    flushList()
    return <div className="space-y-2 text-sm leading-7 text-zinc-300">{blocks}</div>
}

export default function Dashboard() {
    const { chats, currentChat, currentChatId, loading, sendingMessage, error, sendMessage, getAllChats, getChatById, deleteChat, archiveChat, resetCurrentChat, resetChatError } = useChat()
    const { handleLogout } = useAuth()
    const navigate = useNavigate()
    const user = useSelector((state) => state.auth.user)
    const [query, setQuery] = useState('')
    const [message, setMessage] = useState('')
    const [openMenu, setOpenMenu] = useState(null)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [copiedMessageId, setCopiedMessageId] = useState(null)
    const [profileOpen, setProfileOpen] = useState(false)
    const [sidebarProfileOpen, setSidebarProfileOpen] = useState(false)

    useEffect(() => { getAllChats().catch(() => {}) }, [getAllChats])

    const visibleChats = useMemo(() => chats.filter((chat) => (chat.title || 'Untitled conversation').toLowerCase().includes(query.toLowerCase())), [chats, query])
    const messages = currentChat?.messages || []

    const startNewChat = () => { resetCurrentChat(); setMessage(''); setOpenMenu(null); resetChatError() }
    const selectChat = (chatId) => { setOpenMenu(null); getChatById(chatId).catch(() => {}) }
    const removeChat = async (chatId) => { try { await deleteChat(chatId); setOpenMenu(null) } catch { /* Redux exposes the error */ } }
    const toggleArchive = async (chat) => { try { await archiveChat(idOf(chat), !chat.isArchived); setOpenMenu(null) } catch { /* Redux exposes the error */ } }
    const copyResponse = async (item) => {
        try {
            await navigator.clipboard?.writeText(textOf(item))
            setCopiedMessageId(item._id)
            window.setTimeout(() => setCopiedMessageId((current) => current === item._id ? null : current), 1800)
        } catch { /* Clipboard access can be unavailable in some browsers */ }
    }
    const handleComposerKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            event.currentTarget.form?.requestSubmit()
        }
    }
    const logout = async () => {
        await handleLogout()
        navigate('/login')
    }
    const userName = user?.name || 'User'
    const userEmail = user?.email || 'No email available'
    const userInitials = userName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'U'
    const submit = async (event) => {
        event.preventDefault()
        const content = message.trim()
        if (!content || sendingMessage) return
        try { await sendMessage({ message: content, chatId: currentChatId, model: undefined }); setMessage('') } catch { /* keep the composer value available for retry */ }
    }

    return <div className="flex h-screen min-h-[620px] overflow-hidden bg-[#020708] text-zinc-100 font-sans">
        {sidebarOpen && <><button aria-label="Close sidebar" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-20 bg-black/60 backdrop-blur-[2px] md:hidden" /><aside className="fixed inset-y-0 left-0 z-30 flex w-[min(278px,88vw)] shrink-0 flex-col border-r border-cyan-950/60 bg-[#071012]/95 p-3 shadow-2xl shadow-black/50 md:static md:z-auto md:w-[278px] md:shadow-none">
            <div className="flex items-center justify-between px-2 pt-1 pb-6">
                <button onClick={startNewChat} className="flex items-center gap-2 text-lg font-semibold tracking-tight"><span className="flex items-center justify-center h-[27px] w-[27px] rounded-md bg-zinc-100 text-zinc-950 font-serif italic font-extrabold">P</span>perplexity</button>
                <button onClick={() => setSidebarOpen(false)} className="p-2 text-zinc-500 hover:text-white"><PanelLeft size={18} /></button>
            </div>
            <button onClick={startNewChat} className="h-10 flex items-center gap-2 px-3 rounded-xl border border-cyan-800/50 bg-gradient-to-r from-cyan-950/70 to-blue-950/60 hover:from-cyan-900/80 hover:to-blue-900/70 text-sm font-medium transition-colors"><Plus size={17} />New thread</button>
            <div className="flex items-center gap-2 h-9 px-3 mt-5 mb-6 rounded-xl border border-cyan-950/70 bg-black/20 text-zinc-500"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search threads" className="w-full bg-transparent outline-none text-xs text-zinc-200 placeholder:text-zinc-500" /></div>
            <div className="flex items-center justify-between px-2 pb-3 text-[10px] font-bold tracking-widest text-cyan-200/45 uppercase">Your threads<span>{visibleChats.length}</span></div>
            <div className="flex flex-col gap-1 overflow-y-auto">
                {loading && <div className="px-3 py-4 text-xs text-zinc-500">Loading threads…</div>}
                {!loading && visibleChats.map((chat) => <div key={idOf(chat)} className={`group relative flex items-center rounded-lg ${idOf(chat) === currentChatId ? 'bg-cyan-950/60' : 'hover:bg-cyan-950/40'}`}>
                    <button onClick={() => selectChat(idOf(chat))} className="flex flex-1 min-w-0 flex-col gap-1 px-2.5 py-2.5 text-left"><span className="w-full truncate text-[12.5px] text-zinc-300">{chat.title || 'Untitled conversation'}</span><span className="text-[10px] text-zinc-500">{chat.isArchived ? 'Archived' : 'Recent'}</span></button>
                    <button aria-label="Thread options" onClick={() => setOpenMenu(openMenu === idOf(chat) ? null : idOf(chat))} className="w-8 h-8 flex items-center justify-center text-zinc-500 opacity-0 group-hover:opacity-100 hover:text-white"><MoreHorizontal size={17} /></button>
                    {openMenu === idOf(chat) && <div className="absolute right-2 top-9 z-20 w-32 rounded-lg border border-cyan-900/70 bg-[#071012] p-1 shadow-xl"><button onClick={() => toggleArchive(chat)} className="w-full rounded-md px-2 py-2 text-left text-xs text-zinc-300 hover:bg-cyan-950/60">{chat.isArchived ? 'Unarchive' : 'Archive'}</button><button onClick={() => removeChat(idOf(chat))} className="w-full rounded-md px-2 py-2 text-left text-xs text-red-400 hover:bg-cyan-950/60">Delete</button></div>}
                </div>)}
                {!loading && !visibleChats.length && <div className="px-3 py-4 text-xs text-zinc-500">No threads found</div>}
            </div>
            <div className="relative mt-auto border-t border-cyan-950/60 pt-3" onMouseEnter={() => setSidebarProfileOpen(true)} onMouseLeave={() => setSidebarProfileOpen(false)}><button aria-label="Open user profile" aria-expanded={sidebarProfileOpen} onClick={() => setSidebarProfileOpen((open) => !open)} className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-cyan-950/50"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-semibold">{userInitials}</span><span className="flex flex-1 flex-col gap-0.5"><strong className="text-xs font-medium text-zinc-200">{userName}</strong><small className="text-[10px] text-cyan-200/45">Free plan</small></span></button>{sidebarProfileOpen && <div className="absolute bottom-14 left-0 z-40 w-[min(280px,calc(100vw-2rem))] rounded-2xl border border-cyan-700/50 bg-[#071012]/95 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl"><div className="flex items-center gap-3 border-b border-cyan-950/70 pb-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-bold text-slate-950">{userInitials}</div><div className="min-w-0"><p className="truncate text-sm font-semibold text-zinc-100">{userName}</p><p className="truncate text-xs text-cyan-100/55">{userEmail}</p></div></div><div className="space-y-2 py-4 text-xs"><div className="flex items-center justify-between gap-4"><span className="text-cyan-100/45">Account</span><span className="truncate text-zinc-300">Free plan</span></div><div className="flex items-center justify-between gap-4"><span className="text-cyan-100/45">User ID</span><span className="max-w-[150px] truncate text-zinc-400">{user?._id || user?.id || '—'}</span></div></div><button onClick={logout} className="w-full rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2.5 text-left text-xs font-medium text-red-300 transition hover:bg-red-500/20">Log out</button></div>}</div>
        </aside></>}

        <main className="relative flex flex-1 min-w-0 flex-col overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(8,145,178,0.22),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(30,64,175,0.2),_transparent_42%),linear-gradient(135deg,_#020708_0%,_#06181b_52%,_#071329_100%)]"><header className="h-[62px] shrink-0 flex items-center justify-between px-5 md:px-8"><div>{!sidebarOpen && <button aria-label="Open sidebar" onClick={() => setSidebarOpen(true)} className="text-zinc-400 hover:text-white"><Menu size={19} /></button>}</div><div className="relative" onMouseEnter={() => setProfileOpen(true)} onMouseLeave={() => setProfileOpen(false)}><button aria-label="Open user profile" aria-expanded={profileOpen} onClick={() => setProfileOpen((open) => !open)} className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-semibold ring-2 ring-transparent transition hover:ring-cyan-300/50">{userInitials}</button>{profileOpen && <div className="absolute right-0 top-9 z-40 w-[min(280px,calc(100vw-2rem))] rounded-2xl border border-cyan-700/50 bg-[#071012]/95 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl"><div className="flex items-center gap-3 border-b border-cyan-950/70 pb-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-bold text-slate-950">{userInitials}</div><div className="min-w-0"><p className="truncate text-sm font-semibold text-zinc-100">{userName}</p><p className="truncate text-xs text-cyan-100/55">{userEmail}</p></div></div><div className="space-y-2 py-4 text-xs"><div className="flex items-center justify-between gap-4"><span className="text-cyan-100/45">Account</span><span className="truncate text-zinc-300">Free plan</span></div><div className="flex items-center justify-between gap-4"><span className="text-cyan-100/45">User ID</span><span className="max-w-[150px] truncate text-zinc-400">{user?._id || user?.id || '—'}</span></div></div><button onClick={logout} className="w-full rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2.5 text-left text-xs font-medium text-red-300 transition hover:bg-red-500/20">Log out</button></div>}</div></header>
            <section className={`flex-1 min-h-0 flex justify-center overflow-y-auto px-4 md:px-6 ${currentChat ? 'items-start pt-6 md:pt-10' : 'items-center'}`}><div className={`w-full max-w-[700px] ${currentChat ? '' : '-mt-6 md:-mt-16'}`}>
                {!currentChat && <div className="text-center"><div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-2xl bg-zinc-800"><Sparkles size={25} /></div><p className="mb-3 text-xs text-zinc-500">Welcome Back</p><h1 className="text-2xl md:text-[32px] font-semibold tracking-tight">What do you want to know?</h1><p className="mt-3 mb-8 text-xs md:text-sm text-zinc-500">Ask anything. Get a clear, concise answer with sources.</p></div>}
                {!!messages.length && <div className="mb-8 space-y-8">{messages.map((item) => item.role === 'user' ? <div key={item._id} className="flex justify-end"><div className="max-w-[82%] rounded-3xl bg-zinc-800 px-5 py-3.5 text-sm leading-7 text-zinc-100 shadow-sm"><p className="whitespace-pre-wrap">{textOf(item)}</p></div></div> : <div key={item._id} className="group flex gap-3.5"><div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-[13px] font-serif font-extrabold italic text-zinc-950">P</div><div className="min-w-0 flex-1"><MarkdownResponse content={textOf(item)} /><button onClick={() => copyResponse(item)} aria-label={copiedMessageId === item._id ? 'Response copied' : 'Copy response'} className={`mt-4 flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors ${copiedMessageId === item._id ? 'text-emerald-400' : 'text-zinc-500 hover:bg-zinc-800/70 hover:text-zinc-300'}`}>{copiedMessageId === item._id ? <Check size={15} /> : <Copy size={15} />}{copiedMessageId === item._id ? 'Copied' : 'Copy'}</button></div></div>)}</div>}
                {sendingMessage && <div className="mb-4 text-sm text-zinc-500 animate-pulse">Generating an answer…</div>}
                {error && <div className="mb-4 flex items-center justify-between rounded-lg border border-red-900/60 bg-red-950/30 px-3 py-2 text-xs text-red-300"><span>{error}</span><button onClick={resetChatError}>Dismiss</button></div>}
                <form onSubmit={submit} className="rounded-2xl border border-cyan-700/50 bg-black/30 p-2.5 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl focus-within:border-cyan-400/70 sm:p-3"><textarea value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={handleComposerKeyDown} placeholder="Ask anything..." rows={1} className="block max-h-40 min-h-[42px] w-full resize-none bg-transparent px-1 py-1 text-sm leading-6 text-zinc-100 outline-none placeholder:text-cyan-100/40" /><div className="flex items-center justify-end pt-2"><button type="submit" aria-label="Send message" disabled={!message.trim() || sendingMessage} className="flex h-[34px] w-[34px] items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 hover:from-cyan-200 hover:to-blue-400 disabled:opacity-40"><ArrowUp size={18} /></button></div></form><p className="mt-3 text-center text-[10px] text-cyan-100/35">Perplexity can make mistakes. Check important info.</p>
            </div></section></main>
    </div>
}
