import { useState, useEffect } from "react";

import {
  useCurrentUser,
  useAppDispatch,
  useAppSelector,
} from "@/features/auth/hook";

import {
  getConversations,
  createDmConversation,
  getMessages,
  sendMessage,
} from "@/service/chat/chatService";

import {
  setActiveConversation,
  addIncomingMessage,
} from "@/features/chat/chatSlice";

import pusher from "@/libs/pusher";

import Header from "@/layouts/DefaultLayout/components/Header";

import ChatHeader from "@/pages/ChatPvsP/components/ChatHeader";
import ConversationList from "@/pages/ChatPvsP/components/ConversationList";
import MessageList from "@/pages/ChatPvsP/components/MessageList";
import MessageInput from "@/pages/ChatPvsP/components/MessageInput";
import NewChatModal from "@/pages/ChatPvsP/components/NewChatModel";

function ChatPvsP() {
  const dispatch = useAppDispatch();
  const currentUser = useCurrentUser();

  const {
    conversations,
    activeConversation,
    messages,
    loadingConversations,
    loadingMessages,
    creatingConversation,
    sendingMessage,
    error,
  } = useAppSelector((state) => state.chat || {});

  const safeConversations = Array.isArray(conversations) ? conversations : [];

  const safeMessages = Array.isArray(messages) ? messages : [];

  const [newMessage, setNewMessage] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [otherUserId, setOtherUserId] = useState("");

  // Lấy danh sách hội thoại khi vào trang
  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);

  // Lấy tin nhắn khi đổi hội thoại
  useEffect(() => {
    if (activeConversation?.id) {
      dispatch(getMessages(activeConversation.id));
    }
  }, [dispatch, activeConversation?.id]);

  // Kết nối Pusher để nhận tin nhắn realtime
  useEffect(() => {
    if (!activeConversation?.id) return;

    const channelName = `conversation-${activeConversation.id}`;
    const channel = pusher.subscribe(channelName);

    const handleIncomingMessage = (incomingMessage) => {
      if (incomingMessage.conversationId !== activeConversation.id) {
        return;
      }

      dispatch(addIncomingMessage(incomingMessage));
    };

    channel.bind("message:created", handleIncomingMessage);

    return () => {
      channel.unbind("message:created", handleIncomingMessage);
      pusher.unsubscribe(channelName);
    };
  }, [activeConversation?.id, dispatch]);

  // Gửi tin nhắn
  const handleSendMessage = async (e) => {
    e.preventDefault();

    const content = newMessage.trim();

    if (!content || !activeConversation || sendingMessage) {
      return;
    }

    const action = await dispatch(
      sendMessage({
        conversationId: activeConversation.id,
        content,
      }),
    );

    if (sendMessage.fulfilled.match(action)) {
      setNewMessage("");
    }
  };

  // Tạo hội thoại riêng tư
  const handleCreateDm = async (e) => {
    e.preventDefault();

    const userId = otherUserId.trim();

    if (!userId || creatingConversation) return;

    if (userId === currentUser?.id) {
      return;
    }

    const action = await dispatch(createDmConversation(userId));

    if (createDmConversation.fulfilled.match(action)) {
      setShowNewChatModal(false);
      setOtherUserId("");
    }
  };

  // Đóng modal tạo hội thoại
  const handleCloseNewChat = () => {
    setShowNewChatModal(false);
    setOtherUserId("");
  };

  // Lấy tên hội thoại
  const getConversationDisplayName = (conversation) => {
    if (conversation.type === "group") {
      return conversation.name || "Nhóm chưa đặt tên";
    }

    const otherMember = conversation.members?.find(
      (member) => member.id !== currentUser?.id,
    );

    return otherMember?.username || "Đoạn chat trống";
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <Header />

      <div className="flex h-[calc(100vh-65px)] w-full overflow-hidden bg-white dark:bg-gray-900">
        {/* DANH SÁCH HỘI THOẠI */}
        <ConversationList
          conversations={safeConversations}
          activeConversation={activeConversation}
          loading={loadingConversations}
          getDisplayName={getConversationDisplayName}
          onSelectConversation={(conversation) => {
            dispatch(setActiveConversation(conversation));
          }}
          onNewChat={() => setShowNewChatModal(true)}
        />

        {/* KHUNG CHAT */}
        <div className="flex min-w-0 flex-1 flex-col bg-gray-50/50 dark:bg-gray-950">
          {error && (
            <div
              role="alert"
              className="border-b border-red-200 bg-red-50 px-6 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
            >
              {error}
            </div>
          )}

          {activeConversation ? (
            <>
              {/* TIÊU ĐỀ HỘI THOẠI */}
              <ChatHeader
                conversation={activeConversation}
                getDisplayName={getConversationDisplayName}
              />

              {/* DANH SÁCH TIN NHẮN */}
              <MessageList
                messages={safeMessages}
                currentUserId={currentUser?.id}
                loading={loadingMessages}
                conversationId={activeConversation.id}
              />

              {/* NHẬP VÀ GỬI TIN NHẮN */}
              <MessageInput
                value={newMessage}
                onChange={setNewMessage}
                onSubmit={handleSendMessage}
                sending={sendingMessage}
              />
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm font-medium text-gray-400">
              Chọn một cuộc hội thoại để bắt đầu nhắn tin
            </div>
          )}
        </div>

        {/* MODAL TẠO HỘI THOẠI */}
        <NewChatModal
          open={showNewChatModal}
          userId={otherUserId}
          onUserIdChange={setOtherUserId}
          onSubmit={handleCreateDm}
          onClose={handleCloseNewChat}
          creating={creatingConversation}
        />
      </div>
    </div>
  );
}

export default ChatPvsP;
