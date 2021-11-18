/* eslint-disable */
import React, { useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  githubGist,
  darcula,
} from "react-syntax-highlighter/dist/cjs/styles/hljs";

import Utterances from "./Utterances";

const UserCode = ({ user, codeList }) => {
  const [selected, setSelected] = useState(codeList.length - 1);

  const goGit = () => {
    let url = `https://github.com/${user.name}/${user.repoName}/`;
    window.open(url, "_blank").focus();
  };

  return (
    <div className="file-container">
      <div className="header">
        <div className="flex-row">
          <i className="fab fa-git-square" onClick={() => goGit()} />
          <h3>{user.name}</h3>
        </div>
        <DropdownButton
          id="dropdown-basic-button"
          title={codeList[selected].fileName}
          onSelect={(eventKey) => setSelected(eventKey)}
        >
          {codeList.map(({ fileName }, idx) => {
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
        language={codeList[selected].fileName.split(".")[1]}
        style={githubGist}
        showLineNumbers
        // lineProps={{
        //   style: { wordBreak: "break-all", whiteSpace: "pre-wrap" },
        // }}
        // wrapLines={true}
      >
        {Buffer.from(codeList[selected].contents, "base64").toString("utf-8")}
      </SyntaxHighlighter>
      {/* <Utterances /> */}
    </div>
  );
};

export default UserCode;
