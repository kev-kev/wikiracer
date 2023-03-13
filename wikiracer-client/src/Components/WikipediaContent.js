import React, { useContext, useEffect } from 'react'
import { GlobalContext } from '../context/GlobalContext'

const WikipediaContent = () => {
  const { curArticle } = useContext(GlobalContext);

  const getArticle = async () => {
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${curArticle}&origin=*`, {
    });
    const data = await res.json();
    console.log(data);
  }
  
  useEffect(() => {
    getArticle();
  }, [])

  return (
    <div>
      Article content goes here
    </div>
  )
}

export default WikipediaContent