import "../app.css";
import { useFriendStore } from "../stores/friendStores";
import { useNavigate } from "react-router-dom";

export default function IsMakeDm() {
  const { isMakedm, setIsMakedm, findFriends, addFriend } = useFriendStore();

  return (
    isMakedm && (
      <div
        className="makedm-background"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsMakedm(false);
          }
        }}
      >
        <div className="makedm-container">
          <div className="makedm-navbar">
            <div className="makedm-explain"></div>
            <div className="makedm-quit">x</div>
          </div>

          <input
            className="makedm-search"
            placeholder="친구의 사용자 명 입력하기"
          ></input>

          <div className="makedm-list">
            {findFriends.map((a) => (
              <div
                className="makedm-listbox"
                key={a.id}
                onClick={() => {
                  addFriend(a)
                }}
              >
                <div className="makedm-listbox-icon">
                  <img src="public\discord-icon.png"></img>
                </div>
                <div className="makedm-listbox-context">
                  <div className="makedm-listbox-name">{a.name}</div>
                  <div className="makedm-listbox-description">
                    {a.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
}
