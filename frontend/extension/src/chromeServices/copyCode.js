import axios from 'axios'

function copyCode () {
  console.log(process.env.REACT_APP_SERVER_URL)
  const userId = document.querySelector(".loginbar .username")?.innerHTML
  const solvedUserId = document.querySelector('.table-striped')?.childNodes[1]?.childNodes[0]?.childNodes[1]?.textContent
  const resultTable = document.querySelector('.table-striped')
  const correct = (resultTable?.childNodes[1]?.childNodes[0]?.childNodes[4]?.childNodes[0]?.textContent?.includes("맞") || resultTable?.childNodes[1]?.childNodes[0]?.childNodes[4]?.childNodes[0]?.textContent?.includes("100"))
    && userId===solvedUserId
  const problemNumber = resultTable?.childNodes[1]?.childNodes[0]?.childNodes[2]?.textContent
  const problemName = resultTable?.childNodes[1]?.childNodes[0]?.childNodes[3]?.textContent
  const memory = resultTable?.childNodes[1]?.childNodes[0]?.childNodes[5]?.textContent
  const timeConsumed =resultTable?.childNodes[1]?.childNodes[0]?.childNodes[6]?.textContent
  const answerCode = document.getElementsByName("source")[0]?.innerText

  let codeLang = ''
  let site = ''
  const lang = document.querySelector(".table-striped")?.childNodes[1]?.childNodes[0]?.childNodes[7]?.textContent
  if (typeof(lang) === 'string'){
    if(lang.includes('Py')){codeLang = 'py'}
    if(lang.includes('Java')){codeLang = 'java'}
    if(lang.includes('C')){codeLang = 'C'}
    if(lang.includes('Ruby')){codeLang = 'rbw'}
    if(lang.includes('Rust')){codeLang = 'rs'}
    if(lang.includes('Go')){codeLang = 'go'}
    if(lang.includes('node')){codeLang = 'js'}
    if(lang.includes('Text')){codeLang = 'txt'}
    if(lang.includes('Swift')){codeLang = 'swift'}
  } 
  const url = window.location.href
  const SERVER_URL = process.env.REACT_APP_SERVER_URL
  
  window.onload = function afterload(){
    if (url.includes("acmicpc.net")){site = "BOJ"};
    if (url.includes("programmers")){site = "PROGRAMMERS"};
    const data = {
            srcCode: answerCode,
            commit: "DEFAULT",
            language: lang,
            runningTime: timeConsumed,
            runningMemory: memory,
            problemName: problemName,
            problemNumber: problemNumber,
            site: site,
          }
      if (correct){
          axios.post(
          
          `${SERVER_URL}/api/user/commits`, 
          data
          )
        .then((response) => {console.log(response)})
        }
      }
    
      
}

export default copyCode