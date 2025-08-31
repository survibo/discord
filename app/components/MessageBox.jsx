import "../app.css";
import { useFriendStore } from "../stores/friendStores";
import { useNavigate } from "react-router-dom";

export default function MessageBox() {
  const { friends, addFriend, findFriend, deleteFriend } = useFriendStore();
  const navigate = useNavigate();

  return (
    <>
      <div className="main-topbox">
        <div className="main-firstbox-search" onClick={addFriend}>
          대화 찾기 또는 시작하기
        </div>
      </div>

      <div className="main-firstbox-scroll">
        <div className="main-firstbox-menu">
          <div className="main-firstbox-menubox" onClick={() => navigate('/')}>친구</div>
          <div className="main-firstbox-menubox">Nitro 구독하기</div>
          <div className="main-firstbox-menubox">상점</div>
          <hr></hr>
        </div>

        <div className="makedm" onClick={findFriend}>
          * DM 생성 *
        </div>

        <div>다이렉트 메시지</div>

        <div className="message-container">          
          {friends.map((i) => (
            <div
              key={i.id}
              className="message-box"
              onClick={() => navigate(`/dm/${i.id}`)}
            >
              <div className="message-box-icon">{i.name[0]}</div>
              <div className="message-box-context">
                <div className="message-box-name">{i.name}</div>
                <div className="message-box-description">{i.description}</div>
              </div>
              <div
                className="message-box-x"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFriend(i.id);
                }}
              >
                ×
              </div>
            </div>
          ))}

        </div>
      </div>
    </>
  );
}
