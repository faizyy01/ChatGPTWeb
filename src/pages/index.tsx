import { useState, useRef, useEffect } from "react";
import ChatInput from "~/components/inputs/chatInput";
import MessageList from "~/components/surfaces/messageList";
import Sidebar from "../components/Sidebar";
import { api } from "~/utils/api";
import { type messages, type chat, Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import { type Messages } from "~/types/message.types";
export default function Home() {
  const { data } = useSession();
  const [currentChat, setCurrentChat] = useState<chat | null>(null);
  const [messages, setMessages] = useState<Messages[]>([]);
  const chats = api.chatRouter.getChats.useQuery();

  // const databaseMessages = api.chatRouter.getMessages.useQuery({
  //   chatId: currentChat?.id,
  // });

  const getGptResponse = api.chatRouter.getGptResponse.useMutation({
    onSuccess: (data) => {
      console.log(data.content);
      setMessages((messages) => {
        if (messages) {
          return [...messages, data];
        } else {
          return [data];
        }
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // console.log(chats.data);
  // console.log(databaseMessages.data);
  const firstLoad = useRef(false);

  useEffect(() => {
    if (
      chats.data &&
      chats.data.length > 0 &&
      chats.data[0] &&
      !firstLoad.current
    ) {
      firstLoad.current = true;
      setCurrentChat(chats.data[0]);
    }
  }, [chats.data]);

  // useEffect(() => {
  //   if (databaseMessages.data && databaseMessages.data.length > 0) {
  //     const newMessages = databaseMessages.data.map((message) => {
  //       return {
  //         role: message.role,
  //         content: message.message,
  //       };
  //     });
  //     setMessages(newMessages);
  //   }
  // }, [databaseMessages.data]);

  const messageListRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (message: string) => {
    if (message.trim && message.trim() !== "") {
      const newMessage = {
        role: Role.user,
        content: message,
      };

      setMessages((messages) => {
        if (messages) {
          return [...messages, newMessage];
        } else {
          return [newMessage];
        }
      });

      getGptResponse.mutate([...messages, newMessage]);

      // Scroll the message list to the bottom
      if (messageListRef.current) {
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      }
    }
  };

  useEffect(() => {
    if (messageListRef.current) {
      setTimeout(() => {
        if (messageListRef.current)
          messageListRef.current.scrollTop =
            messageListRef.current.scrollHeight;
      }, 100);
    }
  }, [messages]);

  return (
    <main className="min-h-screen bg-black">
      {/* while queries are loading display loading */}
      {chats.isLoading && <div>Loading...</div>}
      {/* if there is an error display error */}
      {chats.isError && <div>{chats.error.message}</div>}
      {/* if there is data display data */}
      {chats.data && (
        <div className="mx-auto h-screen py-10 px-4">
          <div className="flex h-full">
            <Sidebar chats={chats.data} onChatChange={setCurrentChat} />
            <div className="mx-auto flex w-full flex-col md:w-4/6">
              <div
                ref={messageListRef}
                className="message-list mb-4 flex-grow overflow-y-auto"
              >
                <MessageList messages={messages} />
              </div>
              <div className="flex-shrink-0">
                <ChatInput onSubmit={handleSendMessage} />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
