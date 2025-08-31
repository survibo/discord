import { create } from "zustand";
import { supabase } from "../supabaseClient.js";
import { persist } from "zustand/middleware";

export const useFriendStore = create(
  persist(
    (set, get) => ({
      // 상태들
      friends: [],
      findFriends: [],
      isMakedm: false,
      inputValue: "",
      currentUserId: null,
      messages: [],

      // 기존 액션들 그대로
      setInputValue: (value) => set({ inputValue: value }),

      deleteFriend: (newId) =>
        set((state) => ({
          friends: state.friends.filter((friend) => friend.id !== newId),
        })),

      addFriend: (data) => {
        const state = get();
        const duplicateFriend = state.friends.some((a) => a.id === data.id);

        if (!duplicateFriend) {
          set((state) => ({
            friends: [...state.friends, data],
            isMakedm: false
          }))
        } else {
          nevigate(`/friends/${data.id}`);
        }
      },

      addFriendText: async (receiverId) => {
        try {
          // 1. 메시지들 가져오기
          const { data: messagesData, error } = await supabase
            .from("messageByFriends")
            .select("*")
            .eq("receiver", receiverId)
            .order("created_at", { ascending: false });

          if (error) {
            console.error("메시지 로드 실패:", error);
            set({ messages: [] });
            return;
          }

          // 2. 친구 정보 가져오기
          const { data: friendData } = await supabase
            .from("friend")
            .select("name")
            .eq("id", receiverId) // 또는 적절한 컬럼명
            .single();

          // 3. 메시지에 친구 이름 추가
          const messagesWithFriend = messagesData.map((msg) => ({
            ...msg,
            friend: { name: friendData?.name || "알 수 없음" },
          }));

          set({ messages: messagesWithFriend });
        } catch (error) {
          console.error("예상치 못한 에러:", error);
          set({ messages: [] });
        }
      },

      findFriend: async () => {
        const { data, error } = await supabase
          .from("friend")
          .select("id, icon, name, description");

        if (error) {
          console.error("Error finding item:", error);
        } else {
          set({ findFriends: data, isMakedm: true });
        }
      },

      setIsMakedm: (value) => set({ isMakedm: value }),

      textSending: async (id) => {
        const state = get();

        console.log("Sending message:", state.inputValue);

        if (!state.inputValue.trim()) return;

        try {
          await supabase.from("messageByFriends").insert([
            {
              receiver: id,
              text: state.inputValue,
            },
          ]);

          set({ inputValue: "" });
        } catch (error) {
          console.error("전송 실패:", error);
        }
      },

      textSubmit: async (e, id) => {
        e.preventDefault();
        await get().textSending(id);
        get().addFriendText(id);
      },
    }),
    {
      name: "friends-storage",
      partialize: (state) => ({ friends: state.friends }),
    }
  )
);
