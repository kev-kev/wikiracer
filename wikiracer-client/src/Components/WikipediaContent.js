import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import parse, { domToReact }  from 'html-react-parser';
import { useNavigate, useParams, Link } from 'react-router-dom';

const classesToHide = ['reflist', 'reference', 'mw-editsection', 'navbar'];
const idsToHide = ['References', 'Notes'];

const WikipediaContent = () => {
  const { curArticle, isFetching, setIsFetching, setCurArticle, roomCode, history, setHistory, startArticle } = useContext(GlobalContext);
  const [articleText, setArticleText] = useState("");
  let { articleTitle } = useParams();
  
  window.onpopstate = (data) => {
    data.state.idx > history.length ? setHistory([...history, articleTitle]) : setHistory(history.slice(0, history.length-1));
  }

  useEffect(() => {
    setCurArticle(history.at(-1) || startArticle);
  }, [history])

  const getArticle = async () => {
    if(!curArticle) return;
    setIsFetching();
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${curArticle}&origin=*`);
    const data = await res.json();
    const rawHTML = data.parse?.text['*'];
    const parsedData = parse(rawHTML?.toString(), {
      replace: domNode => {
        if(!domNode.attribs) return;
        if(domNode.attribs.class === 'redirectText') {
          console.log("Redirecting to ", data.parse.links.at(-1)['*']);
          setCurArticle(data.parse.links.at(-1)['*']);
          return;
        }
        if(idsToHide.includes(domNode.attribs.id)) return <></>;
        if(domNode.attribs.class){
          for(const className of domNode.attribs.class.split(' ')) {
            if(classesToHide.includes(className)) return <></>;
          }
        }
        if(domNode.name === 'a') {
          const articleName = domNode.attribs.href?.split('/').at(-1);
          return (
            <Link 
              to={`/room/${roomCode}/${articleName}`} 
              className="replaced-link"
              onClick={() => setCurArticle(articleName)}
            >
              {domToReact(domNode.children)}
            </Link>
          );
        }
      }
    });
    if(history.at(-1) !== curArticle) setHistory([...history, curArticle])
    setArticleText(parsedData);
    setIsFetching(false);
  }

  useEffect(() => {
    getArticle();
  }, [curArticle]);

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