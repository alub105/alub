import React from "react";

import UserCode from "./UserCode";

const UserCodeList = ({ fileList }) => {
  return (
    <div className="fileList">
      {fileList
        .map((files, idx) => {
          return (
            <div className="usercode" key={idx} index={idx}>
              <UserCode user={files.member} codeList={files.codeList} />
            </div>
          );
        })}
    </div>
  );
};

export default UserCodeList;
