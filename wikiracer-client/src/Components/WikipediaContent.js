import React, { useContext, useEffect } from 'react'
import { GlobalContext } from '../context/GlobalContext'

const classNamesToHide = ['reflist', 'reference', 'mw-editsection', 'navbar']

const hideClass = (className) => {
  const eles = document.getElementsByClassName(className);
  for(const ele of eles) ele.setAttribute('style', 'display: none;');
}

const WikipediaContent = () => {
  const { curArticle, isFetching, setIsFetching, articleText, setArticleText } = useContext(GlobalContext);

  const getArticle = async () => {
    setIsFetching();
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${curArticle}&origin=*`);
    const data = await res.json();
    setArticleText(data.parse.text['*']);
    setIsFetching(false);
  }
  
  useEffect(() => {
    getArticle();
  }, [curArticle]);

  useEffect(() => {
    document.getElementById('References')?.parentElement.setAttribute('style', 'display: none;');
    document.getElementById('Notes')?.parentElement.setAttribute('style', 'display: none;');
    for(const className of classNamesToHide) hideClass(className);
  }, [articleText])

  return(
    isFetching ? (
      // TODO: Replace with spinner
      <div>
        foo
      </div>
    )
    : (  
      <div className="articleContainer" dangerouslySetInnerHTML={{__html: articleText}}>
      </div>
    ))  
}

export default WikipediaContent