import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import BasicInfo from '../../components/BasicInfo';
import { getPrismicClient } from '../../services/prismic';

// import commonStyles from '../../styles/common.module.scss';
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
  console.log('Post -> post:', post);

  const router = useRouter();

  const words = Math.ceil(
    post.data.content.reduce((acc, curr) => {
      const headingWords = curr?.heading.split(' ').length;
      const bodyWords = RichText.asText(curr?.body).split(' ').length;
      return acc + headingWords + bodyWords;
    }, 0) / 200
  );

  console.log('Post -> words:', words);

  const renderPost = (): JSX.Element => {
    return (
      <article className={styles.post}>
        <img src={`${post.data.banner.url}`} alt="banner" />
        <h1>{post.data.title}</h1>
        <BasicInfo
          publicationDate={post.first_publication_date}
          author={post.data.author}
          minutes={words}
        />
        <div
          className={styles.postContent}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: RichText.asHtml(post.data.content),
          }}
        />
      </article>
    );
  };

  return (
    <main className={styles.contentContainer}>
      {router.isFallback ? <h2>Carregando...</h2> : renderPost()}
    </main>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('post');

  return {
    paths: [
      { params: { slug: posts.results[0].uid } },
      { params: { slug: posts.results[1].uid } },
      // { params: { slug: posts.results[2].uid } },
    ],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const { slug } = params;
  const response = await prismic.getByUID('post', String(slug), {});
  // console.log(
  //   'constgetStaticProps:GetStaticProps= -> response:',
  //   JSON.stringify(response, null, 2)
  // );

  const post = {
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content,
      // content: [
      //   {
      //     heading: response.data.content[0].heading,
      //     body: response.data.content[0].body,
      //   },
      // ],
    },
  };

  return {
    props: {
      post,
    },
    revalidate: 1,
  };
};
