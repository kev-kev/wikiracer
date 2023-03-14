import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { parse } from 'node-html-parser';

const classesToHide = ['reflist', 'reference', 'mw-editsection', 'navbar'];
const idsToHide = ['References', 'Notes'];

const WikipediaContent = () => {
  const { curArticle, isFetching, setIsFetching, articleText, setArticleText } = useContext(GlobalContext);

  const getArticle = async () => {
    setIsFetching();
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${curArticle}&origin=*`);
    const data = await res.json();
    const parsedData = parse(data.parse.text['*']);
    for(const className of classesToHide) {
      for(const ele of parsedData.querySelectorAll('.'+className)) ele.setAttribute('style', 'display: none;');
    }
    for(const id of idsToHide) parsedData.querySelector('#'+id).setAttribute('style', 'display: none;');
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
      <div className="articleContainer" dangerouslySetInnerHTML={{__html: articleText}}>
      </div>
    ))  
}

export default WikipediaContent