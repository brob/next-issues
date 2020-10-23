import ErrorPage from 'next/error'
import {useRouter} from 'next/router'
import {groq} from 'next-sanity'
import {getClient, usePreviewSubscription, imageUrlBuilder} from '../../lib/sanity'
import styles from '../../styles/Home.module.css'

const BlockContent = require('@sanity/block-content-to-react')
const serializers = {
  types: {
    code: props => (
      <pre data-language={props.node.language}>
        <code>{props.node.code}</code>
      </pre>
    )
  }
}
const postQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    body,
    "mainImage": mainImage.asset->,
    "slug": slug.current
  }
`

export default function Post({data, preview}) {
  const router = useRouter()
  if (!router.isFallback && !data.post?.slug) {
    return <ErrorPage statusCode={404} />
  }

  const {data: post} = usePreviewSubscription(postQuery, {
    params: {slug: data.post.slug},
    initialData: data,
    enabled: preview,
  })
  const {title, body, mainImage}  = data.post
  console.log(data.post)
  console.log(imageUrlBuilder.url(mainImage))
  return (
    <div className={styles.container}>
        <a className={styles.title} href="/">
          Next.js blog Home
        </a>
      <h1>{title}</h1>
      <img src={imageUrlBuilder.image(mainImage).width(500).url()} />
      <BlockContent blocks={body} serializers={serializers} />
    </div>
  )
}

export async function getStaticProps({params, preview = false}) {
  const post = await getClient(preview).fetch(postQuery, {
    slug: params.slug,
  })

  return {
    props: {
      preview,
      data: {post},
    },
  }
}

export async function getStaticPaths() {
  const paths = await getClient().fetch(
    groq`*[_type == "post" && defined(slug.current)][].slug.current`
  )

  return {
    paths: paths.map((slug) => ({params: {slug}})),
    fallback: true,
  }
}