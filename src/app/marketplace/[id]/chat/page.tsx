'use client';

import { useState, useEffect, useRef, use } from 'react';
import { ArrowLeft, Send, User } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { useMarketplaceItem } from '@/hooks/use-marketplace-items';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: item, isLoading: itemLoading } = useMarketplaceItem(resolvedParams.id);
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !item) return;

    const initChat = async () => {
      try {
        const buyerId = user.id;
        const sellerId = item.sellerId?._id || item.sellerId;
        
        if (buyerId === sellerId) {
          toast.error("You cannot chat with yourself.");
          setLoading(false);
          return;
        }

        // 1. Find existing chat
        const { data: existingChat, error: chatError } = await supabase
          .from('marketplace_chats')
          .select('*')
          .eq('item_id', item._id)
          .eq('buyer_id', buyerId)
          .maybeSingle();

        let currentChatId = existingChat?.id;

        if (!currentChatId && !chatError) {
          // 2. Create new chat if it doesn't exist
          const { data: newChat, error: createError } = await supabase
            .from('marketplace_chats')
            .insert({
              item_id: item._id,
              buyer_id: buyerId,
              seller_id: sellerId
            })
            .select()
            .single();

          if (!createError && newChat) {
            currentChatId = newChat.id;
          }
        }

        if (currentChatId) {
          setChatId(currentChatId);
          fetchMessages(currentChatId);
          subscribeToMessages(currentChatId);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Error initializing chat:", err);
        setLoading(false);
      }
    };

    initChat();
  }, [user, item]);

  const fetchMessages = async (cId: string) => {
    const { data } = await supabase
      .from('marketplace_messages')
      .select('*')
      .eq('chat_id', cId)
      .order('created_at', { ascending: true });
      
    if (data) setMessages(data);
    setLoading(false);
    scrollToBottom();
  };

  const subscribeToMessages = (cId: string) => {
    supabase
      .channel(`chat_${cId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'marketplace_messages', filter: `chat_id=eq.${cId}` }, payload => {
        setMessages(prev => [...prev, payload.new]);
        scrollToBottom();
      })
      .subscribe();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId || !user) return;

    const messageText = newMessage.trim();
    setNewMessage('');

    // Optimistic update
    const tempMsg = {
      id: Date.now().toString(),
      chat_id: chatId,
      sender_id: user.id,
      content: messageText,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);
    scrollToBottom();

    const { error } = await supabase
      .from('marketplace_messages')
      .insert({
        chat_id: chatId,
        sender_id: user.id,
        content: messageText
      });

    if (error) {
      toast.error("Failed to send message");
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id)); // Revert
    }
  };

  if (itemLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  if (user?.id === item?.sellerId?._id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-center p-6">
        <div>
          <h2 className="text-2xl font-black mb-2 text-foreground">You are the seller</h2>
          <p className="text-muted-foreground mb-6">Sellers access messages from their inbox.</p>
          <Link href={`/marketplace/${resolvedParams.id}`} className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20">
            Back to Item
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground relative selection:bg-primary/30">
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center gap-3">
        <Link href={`/marketplace/${resolvedParams.id}`} className="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-border hover:bg-surface transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 font-black text-lg">
            {(item?.sellerId?.name?.[0] || 'S').toUpperCase()}
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold text-sm leading-tight text-foreground">{item?.sellerId?.name || 'Seller'}</h2>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest truncate max-w-[200px]">Re: {item?.title}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-50 py-20">
            <User className="w-16 h-16 mb-4 text-muted-foreground" />
            <h3 className="text-xl font-black mb-2">Start the conversation</h3>
            <p className="text-sm">Ask about availability, condition, or negotiate price.</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div key={msg.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 ${isMe ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-surface border border-border text-foreground rounded-bl-none'}`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed font-medium">{msg.content}</p>
                  <span className={`text-[9px] block mt-2 font-bold uppercase tracking-widest ${isMe ? 'text-primary-foreground/60 text-right' : 'text-muted-foreground'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={scrollRef} />
      </main>

      <footer className="sticky bottom-0 bg-surface/80 backdrop-blur-xl border-t border-border p-4 pb-safe">
        <form onSubmit={handleSendMessage} className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 h-14 bg-background border border-border rounded-2xl px-5 text-sm font-medium focus:outline-none focus:border-primary transition-colors text-foreground"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="w-14 h-14 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </footer>
    </div>
  );
}
