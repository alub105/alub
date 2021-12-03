import React from "react";

import UserCode from "./UserCode";

const UserCodeList = ({ fileList, problemInfo }) => {
  return (
    <div className="fileList">
      {fileList.map((files, idx) => {
        return (
          <div className="usercode" key={files.member.name} index={idx}>
            <UserCode
              user={files.member}
              codeList={files.codeList}
              problemInfo={problemInfo}
            />
          </div>
        );
      })}
    </div>
  );
};

export default UserCodeList;
