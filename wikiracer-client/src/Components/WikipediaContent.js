import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import parse, { domToReact }  from 'html-react-parser';
import { useNavigate, useParams, Link, useNavigationType} from 'react-router-dom';

const classesToHide = ['reflist', 'reference', 'mw-editsection', 'navbar'];
const idsToHide = ['References', 'Notes'];

const WikipediaContent = () => {
  const { isFetching, setIsFetching, roomCode, startArticle } = useContext(GlobalContext);
  const [articleText, setArticleText] = useState("");
  let { articleTitle } = useParams();
  const navigate = useNavigate();
  
  // window.onpopstate = (data) => {
  //   debugger
  //   data.state.idx > history.length ? setHistory([...history, articleTitle]) : setHistory(history.slice(0, history.length-1));
  // }

  // useEffect(() => {
  //   const location = history.at(-1) || startArticle;
  //   navigate(`/room/${roomCode}/${location}`)
  // }, [history])

  useEffect(() => {
    getArticle();
  }, [articleTitle])

  const getArticle = async () => {
    if(!articleTitle) return;
    setIsFetching();
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${articleTitle}&origin=*`);
    const data = await res.json();
    const rawHTML = data.parse?.text['*'];
    const parsedData = parse(rawHTML?.toString(), {
      replace: domNode => {
        if(!domNode.attribs) return;
        if(domNode.attribs.class === 'redirectText') {
          console.log("Redirecting to ", data.parse.links.at(-1)['*']);
          navigate(`/room/${roomCode}/${data.parse.links.at(-1)['*']}`);
          return;
        }
        if(idsToHide.includes(domNode.attribs.id)) return <></>;
        if(domNode.attribs.class){
          for(const className of domNode.attribs.class.split(' ')) {
            if(classesToHide.includes(className)) return <></>;
          }
        }
        if(domNode.name === 'a') {
          const linkedArticleName = domNode.attribs.href?.split('/').at(-1);
          return (
            <Link 
              to={`/room/${roomCode}/${linkedArticleName}`} 
              className="replaced-link"
              // onClick={() => {
              //   // setCurArticle(linkedArticleName)
              //   // navigate(`/room/${roomCode}/${linkedArticleName}`)
              // }}
            >
              {domToReact(domNode.children)}
            </Link>
          );
        }
      }
    });
    // if(history.at(-1) !== articleTitle) setHistory([...history, articleTitle])
    setArticleText(parsedData);
    setIsFetching(false);
  }

  return(
    isFetching ? (
      // TODO: Replace with spinner
      <div>
        Loading...
      </div>
    )
    : (  
      <div className="articleContainer">
        <h2>{articleTitle}</h2>
        {articleText}
      </div>
    ));
}

export default WikipediaContent