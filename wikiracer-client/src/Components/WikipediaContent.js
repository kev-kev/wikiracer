import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../context/GlobalContext'

const WikipediaContent = () => {
  const { curArticle, isFetching, setIsFetching } = useContext(GlobalContext);
  const [articleText, setArticleText] = useState("");

  const getArticle = async () => {
    setIsFetching();
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${curArticle}&origin=*`, {
    });
    const data = await res.json();
    setArticleText(data.parse.text['*']);
    setIsFetching(false);
  }
  
  useEffect(() => {
    getArticle();
  }, [curArticle])

  return(
    isFetching ? (
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