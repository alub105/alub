import React from "react";

import UserCode from "./UserCode";

const UserCodes = ({fileList}) => {
  return (
    <div className="fileList" >
      {fileList.map((files, idx) => {
        return (
          <div
            className = "usercode"
            key={files.member.name}
            index={idx}
          >
            <UserCode user={files.member} codeList={files.codeList} />
          </div>
        );
      })}
    </div>
  );
};

export default UserCodes;
