import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { groq } from 'next-sanity'
import { getClient } from '../lib/sanity'

export async function  getStaticProps() {
  const query = groq`*[_type == "post"] {
    title,
    "slug": slug.current
  }`
  const posts = await getClient().fetch(query);
  return {
    props: {
      posts: posts
    }
  }
}
export default function Home({posts}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to my <a href="https://nextjs.org">Next.js!</a> Blog
        </h1>
        <h2>Blog posts</h2>
        <ul>
          {posts.map(post => (
            <li><h3><Link href={"/post/" + post.slug}>{post.title}</Link></h3></li>
          ))}
        </ul>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
