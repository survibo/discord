import ServerBar from "../components/ServerBar";
import "../app.css";
import MessageBox from "../components/MessageBox";
import { useFriendStore } from "../stores/friendStores";
import MainSecond from "../components/FriendText";

export default function Home() {
  // 더미 데이터로 친구 목록 표시

  return (
    <div className="container">
      <div className="header">
        <div className="header-icon"></div>
      </div>

      <div className="main">
        <ServerBar />

        <div className="main-screen">
          <div className="main-firstbox">
            <MessageBox />
          </div>

          <div className="main-secondbox">
            <div className="main-topbox"></div>

          </div>
        </div>
      </div>

      <isMakedm />
    </div>
  );
}
