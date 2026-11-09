import { useEffect, useMemo, useState } from 'react'
import { ArrowUp, Check, Copy, Globe, Menu, MoreHorizontal, PanelLeft, Plus, Search, Sparkles } from 'lucide-react'
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
    const [query, setQuery] = useState('')
    const [message, setMessage] = useState('')
    const [openMenu, setOpenMenu] = useState(null)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [copiedMessageId, setCopiedMessageId] = useState(null)

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
    const submit = async (event) => {
        event.preventDefault()
        const content = message.trim()
        if (!content || sendingMessage) return
        try { await sendMessage({ message: content, chatId: currentChatId, model: undefined }); setMessage('') } catch { /* keep the composer value available for retry */ }
    }

    return <div className="flex h-screen min-h-[620px] overflow-hidden bg-[#09090B] text-zinc-100 font-sans">
        {sidebarOpen && <aside className="w-[278px] shrink-0 border-r border-zinc-800 bg-[#111113] flex flex-col p-3">
            <div className="flex items-center justify-between px-2 pt-1 pb-6">
                <button onClick={startNewChat} className="flex items-center gap-2 text-lg font-semibold tracking-tight"><span className="flex items-center justify-center h-[27px] w-[27px] rounded-md bg-zinc-100 text-zinc-950 font-serif italic font-extrabold">P</span>perplexity</button>
                <button onClick={() => setSidebarOpen(false)} className="p-2 text-zinc-500 hover:text-white"><PanelLeft size={18} /></button>
            </div>
            <button onClick={startNewChat} className="h-10 flex items-center gap-2 px-3 rounded-lg border border-zinc-700 bg-zinc-800/60 hover:bg-zinc-800 text-sm font-medium"><Plus size={17} />New thread<span className="ml-auto text-[11px] text-zinc-500">⌘ K</span></button>
            <div className="flex items-center gap-2 h-9 px-3 mt-5 mb-6 rounded-lg bg-zinc-800/70 text-zinc-500"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search threads" className="w-full bg-transparent outline-none text-xs text-zinc-200 placeholder:text-zinc-500" /></div>
            <div className="flex items-center justify-between px-2 pb-3 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Your threads<span>{visibleChats.length}</span></div>
            <div className="flex flex-col gap-1 overflow-y-auto">
                {loading && <div className="px-3 py-4 text-xs text-zinc-500">Loading threads…</div>}
                {!loading && visibleChats.map((chat) => <div key={idOf(chat)} className={`group relative flex items-center rounded-lg ${idOf(chat) === currentChatId ? 'bg-zinc-800' : 'hover:bg-zinc-800/60'}`}>
                    <button onClick={() => selectChat(idOf(chat))} className="flex flex-1 min-w-0 flex-col gap-1 px-2.5 py-2.5 text-left"><span className="w-full truncate text-[12.5px] text-zinc-300">{chat.title || 'Untitled conversation'}</span><span className="text-[10px] text-zinc-500">{chat.isArchived ? 'Archived' : 'Recent'}</span></button>
                    <button onClick={() => setOpenMenu(openMenu === idOf(chat) ? null : idOf(chat))} className="w-8 h-8 flex items-center justify-center text-zinc-500 opacity-0 group-hover:opacity-100 hover:text-white"><MoreHorizontal size={17} /></button>
                    {openMenu === idOf(chat) && <div className="absolute right-2 top-9 z-20 w-32 rounded-lg border border-zinc-700 bg-zinc-900 p-1 shadow-xl"><button onClick={() => toggleArchive(chat)} className="w-full rounded-md px-2 py-2 text-left text-xs text-zinc-300 hover:bg-zinc-800">{chat.isArchived ? 'Unarchive' : 'Archive'}</button><button onClick={() => removeChat(idOf(chat))} className="w-full rounded-md px-2 py-2 text-left text-xs text-red-400 hover:bg-zinc-800">Delete</button></div>}
                </div>)}
                {!loading && !visibleChats.length && <div className="px-3 py-4 text-xs text-zinc-500">No threads found</div>}
            </div>
            <div className="mt-auto border-t border-zinc-800 pt-3"><button className="flex items-center gap-3 w-full px-2 py-2 text-left hover:bg-zinc-800 rounded-lg"><span className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-700 text-xs font-semibold">JS</span><span className="flex-1 flex flex-col gap-0.5"><strong className="text-xs font-medium text-zinc-200">Jiyad Shaikh</strong><small className="text-[10px] text-zinc-500">Free plan</small></span><MoreHorizontal size={17} className="text-zinc-500" /></button></div>
        </aside>}

        <main className="flex flex-1 min-w-0 flex-col bg-[#09090B]"><header className="h-[62px] shrink-0 flex items-center justify-between px-5 md:px-8"><div>{!sidebarOpen && <button onClick={() => setSidebarOpen(true)} className="text-zinc-400 hover:text-white"><Menu size={19} /></button>}</div><div className="flex items-center gap-4"><button className="text-xs text-zinc-400 hover:text-white">Upgrade <span className="ml-1.5 px-1.5 py-1 rounded bg-amber-400/10 text-amber-400 text-[10px] font-bold">Pro</span></button><button className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-700 text-xs font-semibold">JS</button></div></header>
            <section className={`flex-1 min-h-0 flex justify-center overflow-y-auto px-4 md:px-6 ${currentChat ? 'items-start pt-6 md:pt-10' : 'items-center'}`}><div className={`w-full max-w-[700px] ${currentChat ? '' : '-mt-6 md:-mt-16'}`}>
                {!currentChat && <div className="text-center"><div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-2xl bg-zinc-800"><Sparkles size={25} /></div><p className="mb-3 text-xs text-zinc-500">Welcome Back</p><h1 className="text-2xl md:text-[32px] font-semibold tracking-tight">What do you want to know?</h1><p className="mt-3 mb-8 text-xs md:text-sm text-zinc-500">Ask anything. Get a clear, concise answer with sources.</p></div>}
                {!currentChat && <div className="flex flex-wrap justify-center gap-2 mb-5"><button onClick={() => setMessage('What are the best places to visit in Japan?')} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-400"><Globe size={15} className="text-blue-400" />Explore a new topic</button><button onClick={() => setMessage('Help me understand a complex idea')} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-400"><Sparkles size={15} className="text-purple-400" />Understand something</button><button onClick={() => setMessage('Find the latest news')} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-400"><Search size={15} className="text-emerald-400" />Find information</button></div>}
                {!!messages.length && <div className="mb-8 space-y-8">{messages.map((item) => item.role === 'user' ? <div key={item._id} className="flex justify-end"><div className="max-w-[82%] rounded-3xl bg-zinc-800 px-5 py-3.5 text-sm leading-7 text-zinc-100 shadow-sm"><p className="whitespace-pre-wrap">{textOf(item)}</p></div></div> : <div key={item._id} className="group flex gap-3.5"><div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-[13px] font-serif font-extrabold italic text-zinc-950">P</div><div className="min-w-0 flex-1"><MarkdownResponse content={textOf(item)} /><button onClick={() => copyResponse(item)} aria-label={copiedMessageId === item._id ? 'Response copied' : 'Copy response'} className={`mt-4 flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors ${copiedMessageId === item._id ? 'text-emerald-400' : 'text-zinc-500 hover:bg-zinc-800/70 hover:text-zinc-300'}`}>{copiedMessageId === item._id ? <Check size={15} /> : <Copy size={15} />}{copiedMessageId === item._id ? 'Copied' : 'Copy'}</button></div></div>)}</div>}
                {sendingMessage && <div className="mb-4 text-sm text-zinc-500 animate-pulse">Generating an answer…</div>}
                {error && <div className="mb-4 flex items-center justify-between rounded-lg border border-red-900/60 bg-red-950/30 px-3 py-2 text-xs text-red-300"><span>{error}</span><button onClick={resetChatError}>Dismiss</button></div>}
                <form onSubmit={submit} className="rounded-xl border border-zinc-700 bg-[#18181B] p-3 shadow-xl focus-within:border-zinc-500"><textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask anything..." rows={1} className="block w-full min-h-[42px] resize-none bg-transparent px-1 py-1 outline-none text-sm text-zinc-100 placeholder:text-zinc-500" /><div className="flex items-center justify-between pt-2"><div className="flex items-center gap-1"><button type="button" className="flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-zinc-800 text-xs text-zinc-300"><Sparkles size={15} />Focus</button><button type="button" className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs text-zinc-500 hover:bg-zinc-800"><Globe size={15} />Web</button></div><div className="flex items-center gap-3"><button type="submit" aria-label="Send message" disabled={!message.trim() || sendingMessage} className="flex items-center justify-center w-[32px] h-[32px] rounded-lg bg-zinc-100 text-zinc-950 hover:bg-white disabled:opacity-40"><ArrowUp size={18} /></button></div></div></form><p className="mt-3 text-center text-[10px] text-zinc-600">Perplexity can make mistakes. Check important info.</p>
            </div></section><footer className="flex items-center justify-center gap-3 pb-5 text-[10px] text-zinc-600"><button>Help center</button><span>·</span><button>Terms</button><span>·</span><button>Privacy</button></footer></main>
    </div>
}
