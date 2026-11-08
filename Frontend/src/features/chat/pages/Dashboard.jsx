
import { useMemo, useState } from 'react';

import {
    Search,
    Plus,
    Menu,
    Send,
    Sparkles,
    MoreHorizontal,
    Copy,
    Globe,
    PanelLeft,
    ArrowUp
} from 'lucide-react';

const initialChats = [
    { id: 1, title: 'Best places to visit in Japan', time: 'Today' },
    { id: 2, title: 'React performance optimization', time: 'Yesterday' },
    { id: 3, title: 'How does quantum computing work?', time: 'Yesterday' },
    { id: 4, title: 'Easy high-protein recipes', time: 'Oct 24' },
    { id: 5, title: 'The future of renewable energy', time: 'Oct 21' },
];

export default function Dashboard() {

    const [chats, setChats] = useState(initialChats);
    const [activeId, setActiveId] = useState(1);
    const [query, setQuery] = useState('');
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);
    const [openMenu, setOpenMenu] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const visibleChats = useMemo(
        () => chats.filter(chat =>
            chat.title.toLowerCase().includes(query.toLowerCase())
        ),
        [chats, query]
    );

    const startNewChat = () => {
        const id = Date.now();

        setChats(current => [
            { id, title: 'New conversation', time: 'Now' },
            ...current
        ]);

        setActiveId(id);
        setSent(false);
        setMessage('');
    };

    const selectChat = (id) => {
        setActiveId(id);
        setSent(false);
        setOpenMenu(null);
    };

    const removeChat = (id) => {
        setChats(current => current.filter(chat => chat.id !== id));
        setOpenMenu(null);

        if (activeId === id) {
            setActiveId(null);
            setSent(false);
            setMessage('');
        }
    };

    const archiveChat = (id) => {
        removeChat(id);
    };

    const submit = (event) => {
        event.preventDefault();

        if (message.trim()) {
            setSent(true);
        }
    };

    return (
        <div className="flex h-screen min-h-[620px] overflow-hidden bg-[#09090B] text-zinc-100 font-sans">

            {/* SIDEBAR */}

            {sidebarOpen && (
                <aside className="w-[278px] shrink-0 border-r border-zinc-800 bg-[#111113] flex flex-col p-3">

                    {/* BRAND */}

                    <div className="flex items-center justify-between px-2 pt-1 pb-6">

                        <button
                            onClick={startNewChat}
                            className="flex items-center gap-2 text-lg font-semibold tracking-tight"
                        >
                            <span className="flex items-center justify-center h-[27px] w-[27px] rounded-md bg-zinc-100 text-zinc-950 font-serif italic font-extrabold">
                                P
                            </span>

                            perplexity
                        </button>

                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-2 text-zinc-500 hover:text-white transition"
                        >
                            <PanelLeft size={18} />
                        </button>

                    </div>

                    {/* NEW CHAT */}

                    <button
                        onClick={startNewChat}
                        className="h-10 flex items-center gap-2 px-3 rounded-lg border border-zinc-700 bg-zinc-800/60 hover:bg-zinc-800 text-sm font-medium transition"
                    >
                        <Plus size={17} />

                        New thread

                        <span className="ml-auto text-[11px] text-zinc-500">
                            ⌘ K
                        </span>
                    </button>

                    {/* SEARCH */}

                    <div className="flex items-center gap-2 h-9 px-3 mt-5 mb-6 rounded-lg bg-zinc-800/70 text-zinc-500">

                        <Search size={16} />

                        <input
                            value={query}
                            onChange={event => setQuery(event.target.value)}
                            placeholder="Search threads"
                            className="w-full bg-transparent outline-none text-xs text-zinc-200 placeholder:text-zinc-500"
                        />

                        <span className="text-[10px] whitespace-nowrap">
                            ⌘ /
                        </span>

                    </div>

                    {/* CHAT HISTORY */}

                    <div className="flex items-center justify-between px-2 pb-3 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">

                        Your threads

                        <span>{visibleChats.length}</span>

                    </div>

                    <div className="flex flex-col gap-1 overflow-y-auto">

                        {visibleChats.map(chat => (

                            <div
                                key={chat.id}
                                className={`group relative flex items-center rounded-lg transition ${
                                    chat.id === activeId
                                        ? 'bg-zinc-800'
                                        : 'hover:bg-zinc-800/60'
                                }`}
                            >

                                <button
                                    onClick={() => selectChat(chat.id)}
                                    className="flex flex-1 min-w-0 flex-col gap-1 px-2.5 py-2.5 text-left"
                                >

                                    <span className="w-full truncate text-[12.5px] text-zinc-300">
                                        {chat.title}
                                    </span>

                                    <span className="text-[10px] text-zinc-500">
                                        {chat.time}
                                    </span>

                                </button>

                                <button
                                    onClick={() =>
                                        setOpenMenu(
                                            openMenu === chat.id
                                                ? null
                                                : chat.id
                                        )
                                    }
                                    className="w-8 h-8 flex items-center justify-center text-zinc-500 opacity-0 group-hover:opacity-100 hover:text-white transition"
                                >
                                    <MoreHorizontal size={17} />
                                </button>

                                {openMenu === chat.id && (

                                    <div className="absolute right-2 top-9 z-20 w-32 rounded-lg border border-zinc-700 bg-zinc-900 p-1 shadow-xl">

                                        <button
                                            onClick={() => archiveChat(chat.id)}
                                            className="w-full rounded-md px-2 py-2 text-left text-xs text-zinc-300 hover:bg-zinc-800"
                                        >
                                            Archive
                                        </button>

                                        <button
                                            onClick={() => removeChat(chat.id)}
                                            className="w-full rounded-md px-2 py-2 text-left text-xs text-red-400 hover:bg-zinc-800"
                                        >
                                            Delete
                                        </button>

                                    </div>
                                )}

                            </div>

                        ))}

                        {!visibleChats.length && (
                            <div className="px-3 py-4 text-xs text-zinc-500">
                                No threads found
                            </div>
                        )}

                    </div>

                    {/* ACCOUNT */}

                    <div className="mt-auto border-t border-zinc-800 pt-3">

                        <button className="flex items-center gap-3 w-full px-2 py-2 text-left hover:bg-zinc-800 rounded-lg transition">

                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-700 text-xs font-semibold text-white">
                                JS
                            </span>

                            <span className="flex-1 flex flex-col gap-0.5">

                                <strong className="text-xs font-medium text-zinc-200">
                                    Jiyad Shaikh
                                </strong>

                                <small className="text-[10px] text-zinc-500">
                                    Free plan
                                </small>

                            </span>

                            <MoreHorizontal size={17} className="text-zinc-500" />

                        </button>

                    </div>

                </aside>
            )}

            {/* MAIN CONTENT */}

            <main className="flex flex-1 min-w-0 flex-col bg-[#09090B]">

                {/* TOPBAR */}

                <header className="h-[62px] shrink-0 flex items-center justify-between px-5 md:px-8">

                    <div className="flex items-center gap-3">

                        {!sidebarOpen && (

                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="text-zinc-400 hover:text-white"
                            >
                                <Menu size={19} />
                            </button>

                        )}

                        <div className="flex md:hidden items-center gap-2 font-semibold">
                            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-zinc-100 text-zinc-950 font-serif italic">
                                P
                            </span>
                            perplexity
                        </div>

                    </div>

                    <div className="flex items-center gap-4">

                        <button className="text-xs text-zinc-400 hover:text-white transition">
                            Upgrade
                            <span className="ml-1.5 px-1.5 py-1 rounded bg-amber-400/10 text-amber-400 text-[10px] font-bold">
                                Pro
                            </span>
                        </button>

                        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-700 text-xs font-semibold">
                            JS
                        </button>

                    </div>

                </header>

                {/* CONVERSATION */}

                <section className="flex-1 min-h-0 flex items-center justify-center overflow-y-auto px-4 md:px-6">

                    <div className="w-full max-w-[700px] -mt-6 md:-mt-16">

                        {/* WELCOME */}

                        {!sent && (

                            <div className="text-center">

                                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-2xl bg-zinc-800 text-zinc-100">

                                    <Sparkles size={25} />

                                </div>

                                <p className="mb-3 text-xs text-zinc-500">
                                    Welcome back, Jiyad
                                </p>

                                <h1 className="text-2xl md:text-[32px] font-semibold tracking-tight text-zinc-100">
                                    What do you want to know?
                                </h1>

                                <p className="mt-3 mb-8 text-xs md:text-sm text-zinc-500">
                                    Ask anything. Get a clear, concise answer with sources.
                                </p>

                            </div>

                        )}

                        {/* SUGGESTIONS */}

                        {!sent && (

                            <div className="flex flex-wrap justify-center gap-2 mb-5">

                                <button
                                    onClick={() => setMessage('What are the best places to visit in Japan?')}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-400 transition"
                                >
                                    <Globe size={15} className="text-blue-400" />
                                    Explore a new topic
                                </button>

                                <button
                                    onClick={() => setMessage('Help me understand a complex idea')}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-400 transition"
                                >
                                    <Sparkles size={15} className="text-purple-400" />
                                    Understand something
                                </button>

                                <button
                                    onClick={() => setMessage('Find the latest news')}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-400 transition"
                                >
                                    <Search size={15} className="text-emerald-400" />
                                    Find information
                                </button>

                            </div>

                        )}

                        {/* RESPONSE */}

                        {sent && (

                            <div className="mb-5 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">

                                <div className="px-4 py-3 bg-zinc-800/50 text-sm font-medium text-zinc-200">
                                    {message}
                                </div>

                                <div className="p-4">

                                    <div className="flex items-center gap-2 text-sm">

                                        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-zinc-100 text-zinc-950 font-serif italic font-bold">
                                            P
                                        </span>

                                        <strong>Answer</strong>

                                        <span className="ml-auto px-2 py-1 rounded-md bg-zinc-800 text-[10px] text-zinc-400">
                                            Sources
                                        </span>

                                    </div>

                                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                                        Here’s a focused answer to get you started.
                                        Perplexity searches the web in real time and
                                        summarizes the most useful information with
                                        links to the original sources.
                                    </p>

                                    <div className="flex gap-2 mt-4 pt-3 border-t border-zinc-800">

                                        <button className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-zinc-500 hover:bg-zinc-800">
                                            <Copy size={15} />
                                            Copy
                                        </button>

                                        <button className="px-2 py-1.5 rounded-md text-zinc-500 hover:bg-zinc-800">
                                            <MoreHorizontal size={16} />
                                        </button>

                                    </div>

                                </div>

                            </div>

                        )}

                        {/* MESSAGE COMPOSER */}

                        <form
                            onSubmit={submit}
                            className="rounded-xl border border-zinc-700 bg-[#18181B] p-3 shadow-xl shadow-black/20 focus-within:border-zinc-500 transition"
                        >

                            <textarea
                                value={message}
                                onChange={event => setMessage(event.target.value)}
                                placeholder="Ask anything..."
                                rows={1}
                                className="block w-full min-h-[42px] resize-none bg-transparent px-1 py-1 outline-none text-sm text-zinc-100 placeholder:text-zinc-500"
                            />

                            <div className="flex items-center justify-between pt-2">

                                <div className="flex items-center gap-1">

                                    <button
                                        type="button"
                                        className="flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-zinc-800 text-xs text-zinc-300"
                                    >
                                        <Sparkles size={15} />
                                        Focus
                                    </button>

                                    <button
                                        type="button"
                                        className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                                    >
                                        <Globe size={15} />
                                        Web
                                    </button>

                                </div>

                                <div className="flex items-center gap-3">

                                    <span className="hidden sm:block text-[10px] text-zinc-600">
                                        Press Enter to send
                                    </span>

                                    <button
                                        type="submit"
                                        aria-label="Send message"
                                        className="flex items-center justify-center w-[32px] h-[32px] rounded-lg bg-zinc-100 text-zinc-950 hover:bg-white transition disabled:opacity-40"
                                        disabled={!message.trim()}
                                    >
                                        <ArrowUp size={18} />
                                    </button>

                                </div>

                            </div>

                        </form>

                        <p className="mt-3 text-center text-[10px] text-zinc-600">
                            Perplexity can make mistakes. Check important info.
                        </p>

                    </div>

                </section>

                {/* FOOTER */}

                <footer className="flex items-center justify-center gap-3 pb-5 text-[10px] text-zinc-600">

                    <button className="hover:text-zinc-300">Help center</button>
                    <span>·</span>
                    <button className="hover:text-zinc-300">Terms</button>
                    <span>·</span>
                    <button className="hover:text-zinc-300">Privacy</button>

                </footer>

            </main>

        </div>
    );
}
