import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { create } from "zustand";
import { createClient } from "@supabase/supabase-js";
import { persist } from "zustand/middleware";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root
}, Symbol.toStringTag, { value: "Module" }));
function ServerBar() {
  return /* @__PURE__ */ jsxs("div", { className: "server-bar", children: [
    /* @__PURE__ */ jsx("div", { className: "server-icon home-icon" }),
    /* @__PURE__ */ jsx("hr", {})
  ] });
}
const supabaseUrl = "https://mvodnekhxfhxfkpfvpyn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12b2RuZWtoeGZoeGZrcGZ2cHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMzI2MjYsImV4cCI6MjA3MTYwODYyNn0.hcZDEtXTuvsS6_6ZcUUrhP3shZ-vpofFkeSqDq_lT8o";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const useFriendStore = create(
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
      deleteFriend: (newId) => set((state) => ({
        friends: state.friends.filter((friend) => friend.id !== newId)
      })),
      addFriend: (data) => {
        const state = get();
        const duplicateFriend = state.friends.some((a) => a.id === data.id);
        if (!duplicateFriend) {
          set((state2) => ({
            friends: [...state2.friends, data],
            isMakedm: false
          }));
        } else {
          nevigate(`/friends/${data.id}`);
        }
      },
      addFriendText: async (receiverId) => {
        try {
          const { data: messagesData, error } = await supabase.from("messageByFriends").select("*").eq("receiver", receiverId).order("created_at", { ascending: false });
          if (error) {
            console.error("메시지 로드 실패:", error);
            set({ messages: [] });
            return;
          }
          const { data: friendData } = await supabase.from("friend").select("name").eq("id", receiverId).single();
          const messagesWithFriend = messagesData.map((msg) => ({
            ...msg,
            friend: { name: (friendData == null ? void 0 : friendData.name) || "알 수 없음" }
          }));
          set({ messages: messagesWithFriend });
        } catch (error) {
          console.error("예상치 못한 에러:", error);
          set({ messages: [] });
        }
      },
      findFriend: async () => {
        const { data, error } = await supabase.from("friend").select("id, icon, name, description");
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
              text: state.inputValue
            }
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
      }
    }),
    {
      name: "friends-storage",
      partialize: (state) => ({ friends: state.friends })
    }
  )
);
function MessageBox() {
  const { friends: friends2, addFriend, findFriend, deleteFriend } = useFriendStore();
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "main-topbox", children: /* @__PURE__ */ jsx("div", { className: "main-firstbox-search", onClick: addFriend, children: "대화 찾기 또는 시작하기" }) }),
    /* @__PURE__ */ jsxs("div", { className: "main-firstbox-scroll", children: [
      /* @__PURE__ */ jsxs("div", { className: "main-firstbox-menu", children: [
        /* @__PURE__ */ jsx("div", { className: "main-firstbox-menubox", onClick: () => navigate("/"), children: "친구" }),
        /* @__PURE__ */ jsx("div", { className: "main-firstbox-menubox", children: "Nitro 구독하기" }),
        /* @__PURE__ */ jsx("div", { className: "main-firstbox-menubox", children: "상점" }),
        /* @__PURE__ */ jsx("hr", {})
      ] }),
      /* @__PURE__ */ jsx("div", { className: "makedm", onClick: findFriend, children: "* DM 생성 *" }),
      /* @__PURE__ */ jsx("div", { children: "다이렉트 메시지" }),
      /* @__PURE__ */ jsx("div", { className: "message-container", children: friends2.map((i) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "message-box",
          onClick: () => navigate(`/dm/${i.id}`),
          children: [
            /* @__PURE__ */ jsx("div", { className: "message-box-icon", children: i.name[0] }),
            /* @__PURE__ */ jsxs("div", { className: "message-box-context", children: [
              /* @__PURE__ */ jsx("div", { className: "message-box-name", children: i.name }),
              /* @__PURE__ */ jsx("div", { className: "message-box-description", children: i.description })
            ] }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "message-box-x",
                onClick: (e) => {
                  e.stopPropagation();
                  deleteFriend(i.id);
                },
                children: "×"
              }
            )
          ]
        },
        i.id
      )) })
    ] })
  ] });
}
function FriendText() {
  const { inputValue, setInputValue, textSubmit, addFriendText, messages } = useFriendStore();
  const userId = useParams().id;
  useEffect(() => {
    addFriendText(userId);
  }, [userId]);
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "text-container", children: [
    /* @__PURE__ */ jsx("div", { className: "text-list", children: messages.map((a) => {
      console.log("message item:", a);
      return /* @__PURE__ */ jsxs("div", { className: "text-list-box", children: [
        /* @__PURE__ */ jsx("div", { className: "text-list-icon" }),
        /* @__PURE__ */ jsxs("div", { className: "text-list-context", children: [
          /* @__PURE__ */ jsx("div", { className: "text-list-name", children: a.friend.name }),
          /* @__PURE__ */ jsx("div", { className: "text-list-text", children: a.text })
        ] })
      ] }, a.id);
    }) }),
    /* @__PURE__ */ jsx("div", { className: "text-typing", children: /* @__PURE__ */ jsx(
      "form",
      {
        onSubmit: (e) => textSubmit(e, userId),
        className: "text-typing-form",
        children: /* @__PURE__ */ jsx(
          "input",
          {
            className: "text-typing-input",
            value: inputValue,
            onChange: (e) => setInputValue(e.target.value),
            placeholder: "메시지 입력..."
          }
        )
      }
    ) })
  ] }) });
}
const _index = UNSAFE_withComponentProps(function Home() {
  return /* @__PURE__ */ jsxs("div", {
    className: "container",
    children: [/* @__PURE__ */ jsx("div", {
      className: "header",
      children: /* @__PURE__ */ jsx("div", {
        className: "header-icon"
      })
    }), /* @__PURE__ */ jsxs("div", {
      className: "main",
      children: [/* @__PURE__ */ jsx(ServerBar, {}), /* @__PURE__ */ jsxs("div", {
        className: "main-screen",
        children: [/* @__PURE__ */ jsx("div", {
          className: "main-firstbox",
          children: /* @__PURE__ */ jsx(MessageBox, {})
        }), /* @__PURE__ */ jsx("div", {
          className: "main-secondbox",
          children: /* @__PURE__ */ jsx("div", {
            className: "main-topbox"
          })
        })]
      })]
    }), /* @__PURE__ */ jsx("isMakedm", {})]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _index
}, Symbol.toStringTag, { value: "Module" }));
function IsMakeDm() {
  const { isMakedm, setIsMakedm, findFriends, addFriend } = useFriendStore();
  useNavigate();
  return isMakedm && /* @__PURE__ */ jsx(
    "div",
    {
      className: "makedm-background",
      onClick: (e) => {
        if (e.target === e.currentTarget) {
          setIsMakedm(false);
        }
      },
      children: /* @__PURE__ */ jsxs("div", { className: "makedm-container", children: [
        /* @__PURE__ */ jsxs("div", { className: "makedm-navbar", children: [
          /* @__PURE__ */ jsx("div", { className: "makedm-explain" }),
          /* @__PURE__ */ jsx("div", { className: "makedm-quit", children: "x" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "makedm-search",
            placeholder: "친구의 사용자 명 입력하기"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "makedm-list", children: findFriends.map((a) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "makedm-listbox",
            onClick: () => {
              addFriend(a);
            },
            children: [
              /* @__PURE__ */ jsx("div", { className: "makedm-listbox-icon", children: /* @__PURE__ */ jsx("img", { src: "public\\discord-icon.png" }) }),
              /* @__PURE__ */ jsxs("div", { className: "makedm-listbox-context", children: [
                /* @__PURE__ */ jsx("div", { className: "makedm-listbox-name", children: a.name }),
                /* @__PURE__ */ jsx("div", { className: "makedm-listbox-description", children: a.description })
              ] })
            ]
          },
          a.id
        )) })
      ] })
    }
  );
}
function FriendInfo() {
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("div", { className: "friend-info" }) });
}
const dm_$id = UNSAFE_withComponentProps(function friends() {
  return /* @__PURE__ */ jsxs("div", {
    className: "container",
    children: [/* @__PURE__ */ jsx("div", {
      className: "header",
      children: /* @__PURE__ */ jsx("div", {
        className: "header-icon"
      })
    }), /* @__PURE__ */ jsxs("div", {
      className: "main",
      children: [/* @__PURE__ */ jsx(ServerBar, {}), /* @__PURE__ */ jsxs("div", {
        className: "main-screen",
        children: [/* @__PURE__ */ jsx("div", {
          className: "main-firstbox",
          children: /* @__PURE__ */ jsx(MessageBox, {})
        }), /* @__PURE__ */ jsxs("div", {
          className: "main-secondbox",
          children: [/* @__PURE__ */ jsx("div", {
            className: "main-topbox"
          }), /* @__PURE__ */ jsxs("div", {
            className: "main-second-box",
            children: [/* @__PURE__ */ jsx(FriendText, {}), /* @__PURE__ */ jsx(FriendInfo, {})]
          })]
        })]
      })]
    }), /* @__PURE__ */ jsx(IsMakeDm, {})]
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: dm_$id
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-BMP3wnRq.js", "imports": ["/assets/chunk-PVWAREVJ-CzyUIOm_.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-C40zBVSU.js", "imports": ["/assets/chunk-PVWAREVJ-CzyUIOm_.js"], "css": ["/assets/app-BKFeQzu7.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_index-BBLSkRxv.js", "imports": ["/assets/chunk-PVWAREVJ-CzyUIOm_.js", "/assets/MessageBox-EhFmXogm.js"], "css": ["/assets/app-BKFeQzu7.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/dm.$id": { "id": "routes/dm.$id", "parentId": "root", "path": "/dm/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/dm._id-uW_yUFVg.js", "imports": ["/assets/chunk-PVWAREVJ-CzyUIOm_.js", "/assets/MessageBox-EhFmXogm.js"], "css": ["/assets/app-BKFeQzu7.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-c241f6b4.js", "version": "c241f6b4", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/dm.$id": {
    id: "routes/dm.$id",
    parentId: "root",
    path: "/dm/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
