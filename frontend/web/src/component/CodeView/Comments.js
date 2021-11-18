/* eslint-disable */
import React, { createRef, useEffect } from "react";

const Comments = ({ user, problemInfo }) => {
  const commentRef = createRef();
  useEffect(() => {
    const utterances = document.createElement("script");
    const utterancesConfig = {
      src: "https://utteranc.es/client.js",
      repo: `${user.name}/${user.repoName}`,
      theme: "github-light",
      crossorigin: "anonymous",
      async: true,
      "issue-term": `[${problemInfo.site}] ${problemInfo.title} ${
        problemInfo.num
      } - ${problemInfo.level}`,
    };

    Object.entries(utterancesConfig).forEach(([key, value]) => {
      utterances.setAttribute(key, value);
    });

    commentRef.current.appendChild(utterances);
  }, []);

  return <div className="comments" ref={commentRef} />;
};

export default Comments;
