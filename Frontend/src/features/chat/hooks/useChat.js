import { initializeSocket } from "../services/socket.service.js";
import { useDispatch } from "react-redux";
import { setChat, setCurrentChatId ,setLoading, setError } from "../chat.slice.js";
import { sendMessage, getAllChats, getChatById, updateChat, deleteChat, archiveChat } from "../services/chat.services.js";

export const useChat = () => {

    const dispatch = useDispatch();
    
    return {
        initializeSocket
    };
}