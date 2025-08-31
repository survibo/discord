import "../app.css";
import IsMakeDm from "../components/IsMakeDm";
import { useFriendStore } from "../stores/friendStores";

import ServerBar from "../components/ServerBar";
import MessageBox from "../components/MessageBox";
import FriendText from "../components/FriendText";
import FriendInfo from "../components/FriendInfo";

export default function friends() {
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
            <div className="main-second-box">
              <FriendText />
              <FriendInfo />
            </div>
          </div>
        </div>
      </div>

      <IsMakeDm />
    </div>
  );
}
