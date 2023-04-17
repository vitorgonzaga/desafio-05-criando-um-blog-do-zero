import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import BasicInfo from '../../components/BasicInfo';
import { getPrismicClient } from '../../services/prismic';

import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  const calculateMinutes = (): number => {
    const minutesCalculated = post?.data?.content?.reduce((acc, curr) => {
      const headingWords = curr?.heading?.split(' ');
      const bodyWords = RichText.asText(curr?.body)?.split(' ');
      return acc + headingWords?.length + bodyWords?.length;
    }, 0);

    return Math.ceil(minutesCalculated / 200);
  };

  if (router.isFallback) {
    return <h2>Carregando...</h2>;
  }

  return (
    <main className={styles.contentContainer}>
      <article className={styles.post}>
        <img src={`${post.data.banner.url}`} alt="banner" />
        <h1>{post.data.title}</h1>
        <BasicInfo
          publicationDate={post.first_publication_date}
          author={post.data.author}
          minutes={post.data.content ? calculateMinutes() : 0}
        />
        {post.data.content.map(item => (
          <div key={item.heading} className={styles.postContent}>
            <h3>{item?.heading}</h3>
            <div
              className={styles.postContent}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: RichText.asHtml(item?.body),
              }}
            />
          </div>
        ))}
      </article>
    </main>
  );
}
export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('post');

  return {
    paths: [
      { params: { slug: String(posts.results[0].uid) } },
      { params: { slug: String(posts.results[1].uid) } },
    ],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const { slug } = params;
  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    first_publication_date: response.first_publication_date,
    uid: response.uid,
    data: {
      subtitle: response.data.subtitle,
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content,
    },
  };

  return {
    props: {
      post,
    },
    revalidate: 1,
  };
};
