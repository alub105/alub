/* eslint-disable */
import React, { useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  githubGist,
  darcula,
} from "react-syntax-highlighter/dist/cjs/styles/hljs";

import Comments from "./Comments";

const UserCode = ({ user, codeList, problemInfo }) => {
  const [selected, setSelected] = useState(codeList.length - 1);

  const goGit = () => {
    let url = `https://github.com/${user.name}/${user.repoName}/`;
    window.open(url, "_blank").focus();
  };

  const getLanguage = (type) => {
    if(type == "py"){
      return "python";
    }

    if(type == "rbw"){
      return "ruby"; 
    }
    
    if(type == "rs"){
      return "rust"; 
    }
    
    return type;
  }

  return (
    <div className="file-container">
      <div className="user-header">
        <div className="flex-row">
          <i className="fab fa-git-square" onClick={() => goGit()} />
          <h3 className="user-name">{user.name}</h3>
        </div>
        <DropdownButton
          id="dropdown-basic-button"
          title={codeList[selected].fileName}
          onSelect={(eventKey) => setSelected(eventKey)}
        >
          {codeList?.map(({ fileName }, idx) => {
            return (
              <Dropdown.Item key={idx} eventKey={idx}>
                {fileName}
              </Dropdown.Item>
            );
          })}
        </DropdownButton>
      </div>
      <SyntaxHighlighter
        className="code"
        language={getLanguage(codeList[selected].fileName.split(".")[1])}
        style={githubGist}
        showLineNumbers
        // lineProps={{
        //   style: { wordBreak: "break-all", whiteSpace: "pre-wrap" },
        // }}
        // wrapLines={true}
      >
        {Buffer.from(codeList[selected].contents, "base64").toString("utf-8")}
      </SyntaxHighlighter>
      <Comments className="comment" user={user} problemInfo={problemInfo} />
    </div>
  );
};

export default UserCode;
