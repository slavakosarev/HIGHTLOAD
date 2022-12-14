import './news.module.scss';
import { useEffect, useState } from 'react';
import getData from '../utils/getData';

/* eslint-disable-next-line */
export interface NewsProps {}
export interface PeaceOfNews {
  id: number,
  title: string,
  description: string,
  createdAt: number
}

export function News(props: NewsProps) {
  const [news, setNews] = useState([] as PeaceOfNews[]);
  const sortNews = (news: PeaceOfNews[] | unknown) => {
    if (news instanceof Array) {
      return news.sort((a, b) => a.createdAt - b.createdAt)
    }
    return []
  }

  useEffect(() => {
    // fetch('http://localhost:3333/api/news')
    //   .then(response => response.json())
    //   .then(news => {
    //     const sortedNews = sortNews(news);
    getData('http://localhost:3333/api/news')
      .then((news) => {
      const sortedNews = sortNews(news);
      setNews(sortedNews);
      })
  }, []);

  return (
    <div>
      <h1>Последние новости</h1>
      <ul>
      {news.map(peaceOfNews => {
        return <li key={peaceOfNews.id}>
          <h2>{peaceOfNews.title}</h2>
          <p>{peaceOfNews.description}</p>
          <hr/>
        </li>
      })}
      </ul>
    </div>
  );
}

export default News;
