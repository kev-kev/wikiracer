import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../context/GlobalContext';
// import { parse } from 'node-html-parser';
import parse  from 'html-react-parser';

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
        if(domNode.name === 'a') return (
          <span onClick={handleLinkClick}>hihi</span>
        )
        // debugger
      }
    });
    // for(const className of classesToHide) {
    //   for(const ele of parsedData.querySelectorAll('.'+className)) ele.setAttribute('style', 'display: none;');
    // }
    // for(const id of idsToHide) parsedData.querySelector('#'+id).setAttribute('style', 'display: none;');

    // for(const link of parsedData.querySelectorAll('a')) {
    //   debugger
    // }
    // debugger
    setArticleText(parsedData);
    setIsFetching(false);
  }
  
  /**
   * want to have links keep you in the room, but change the content of the curArticle
   * get all anchor tags and add onclick handler
   */

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