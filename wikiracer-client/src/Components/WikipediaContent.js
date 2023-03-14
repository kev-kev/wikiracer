import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../context/GlobalContext';
// import { parse } from 'node-html-parser';
import parse, { domToReact }  from 'html-react-parser';

const classesToHide = ['reflist', 'reference', 'mw-editsection', 'navbar'];
const idsToHide = ['References', 'Notes'];

const handleLinkClick = () => {
  console.log('hihihihihi clickyclick')
}

const WikipediaContent = () => {
  const { curArticle, isFetching, setIsFetching, articleText, setArticleText } = useContext(GlobalContext);

  const getArticle = async () => {
    if(!curArticle)return;
    setIsFetching();
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${curArticle}&origin=*`);
    const data = await res.json();
    const rawHTML = await data.parse?.text['*'];
    // debugger
    const parsedData = parse(rawHTML?.toString(), {
      replace: domNode => {
        if(classesToHide.includes(domNode.attribs?.class) || idsToHide.includes(domNode.attribs?.id)) return <></>
        if(domNode.name === 'a') return (
          <span onClick={handleLinkClick} className="replaced-link" >{domToReact(domNode.children)}</span>
        )
      }
    });
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
        {articleText}
      </div>
    ))  
}

export default WikipediaContent