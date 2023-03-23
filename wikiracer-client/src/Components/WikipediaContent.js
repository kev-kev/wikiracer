import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import parse, { domToReact }  from 'html-react-parser';
import { useNavigate, useParams, Link, useNavigationType} from 'react-router-dom';

const classesToHide = ['reflist', 'reference', 'mw-editsection', 'navbar'];
const idsToHide = ['References', 'Notes'];

const WikipediaContent = () => {
  const { isFetching, setIsFetching, gameInProgress, winner, host } = useContext(GlobalContext);
  const [articleText, setArticleText] = useState("");
  let { roomID, articleTitle } = useParams();
  const navigate = useNavigate();
  
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
          navigate(`/room/${roomID}/${data.parse.links.at(-1)['*']}/`);
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
            <Link to={`/room/${roomID}/${linkedArticleName}/`} className="replaced-link">
              {domToReact(domNode.children)}
            </Link>
          );
        }
      }
    });
    setArticleText(parsedData);
    setIsFetching(false);
  }

  // TODO: Move winner and waiting screens to own component(s) 
  if (isFetching) {
    return (<div> Loading... </div>);
  } else if (!gameInProgress) {
    if (winner) {
      return (<div>{winner} has won!</div>);
    } else {
      return (<div> Waiting for {host} to start the game... </div>);
    }
  } else {
    return (
      <div className="articleContainer">
        <h2>{articleTitle?.split("_").join(" ")}</h2>
        {articleText}
      </div>
    );
  }
}

export default WikipediaContent