import {useLoaderData} from "remix"
import type {LoaderFunction} from "remix"
import {getPost} from "~/post"
import type {Post} from "~/post"
import invariant from "tiny-invariant"

const loader: LoaderFunction = async ({params}) => {
    invariant(params.slug, "expected params.slug")
    return getPost(params.slug)
}

const Post = () => {
    const post = useLoaderData<Post>()
    return <div dangerouslySetInnerHTML={{__html: post.html}} />
}

export default Post
export {loader}
