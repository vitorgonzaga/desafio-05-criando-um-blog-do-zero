import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getPrismicClient } from '../services/prismic';

import BasicInfo from '../components/BasicInfo';
import styles from './home.module.scss';
// import commonStyles from '../styles/common.module.scss';
// import { hrefResolver, linkResolver } from 'prismic-configuration';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  // eslint-disable-next-line no-console
  console.log('Home -> postsPagination:', postsPagination.results[0]);
  const [repository, setRepository] = useState([]);

  useEffect(() => {
    setRepository(postsPagination.results);
  }, [postsPagination]);

  const fetchMorePosts = (next_page: string): void => {
    fetch(next_page)
      .then(resp => resp.json())
      .then(data => {
        const result = data.results.map(post => {
          return {
            uid: post.uid,
            first_publication_date: post.first_publication_date,
            data: {
              title: post.data.title,
              subtitle: post.data.subtitle,
              author: post.data.author,
            },
          };
        });
        setRepository(result);
      });
  };

  return (
    <main className={styles.contentContainer}>
      {repository.map(post => (
        <div key={post.uid} className={styles.post}>
          <Link href={`/post/${post.uid}`}>
            <h1>{post.data.title}</h1>
          </Link>
          <p>{post.data.subtitle}</p>
          <BasicInfo
            publicationDate={post.first_publication_date}
            author={post.data.author}
          />
        </div>
      ))}
      {postsPagination?.next_page ? (
        <button
          type="button"
          onClick={() => fetchMorePosts(postsPagination?.next_page)}
        >
          <h2>Carregar mais posts</h2>
        </button>
      ) : null}
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('post', { pageSize: 5 });
  // eslint-disable-next-line no-console
  console.log('postsResponse: ', JSON.stringify(postsResponse, null, 2));

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: [...posts],
      },
    },
  };
};
