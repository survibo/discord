import "../app.css";
import { useFriendStore } from "../stores/friendStores";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export default function FriendText() {
  const { inputValue, setInputValue, textSubmit, addFriendText, messages } =
    useFriendStore();
  const userId = useParams().id;

  useEffect(() => {
    addFriendText(userId);
  }, [userId]);

  return (
    <>
      <div className="text-container">
        <div className="text-list">
          {messages.map((a) => {
            console.log("message item:", a);
            return (
              <div className="text-list-box" key={a.id}>
                <div className="text-list-icon"></div>
                <div className="text-list-context">
                  <div className="text-list-name">{a.friend.name}</div>
                  <div className="text-list-text">{a.text}</div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-typing">
          <form
            onSubmit={(e) => textSubmit(e, userId)}
            className="text-typing-form"
          >
            <input
              className="text-typing-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="메시지 입력..."
            />
          </form>
        </div>
      </div>
    </>
  );
}

function Test() {
  return (
    <>
      <div className="text-list-box">
        <div className="test-list-icon"></div>
        <div className="text-list-context">
          <div className="text-list-name">test</div>
          <div className="text-list-text">test 입니다 </div>
        </div>
      </div>
    </>
  );
}
