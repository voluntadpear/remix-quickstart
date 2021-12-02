import {Link, useLoaderData} from "remix"
import {getPosts} from "~/post"
import type {Posts as PostsType} from "~/post"

const loader = () => {
    return getPosts()
}

const Posts = () => {
    const posts = useLoaderData<PostsType>()

    return (
        <div>
            <h1>Posts</h1>

            <ul>
                {posts.map(post => (
                    <li key={post.slug}>
                        <Link to={post.slug}>{post.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Posts
export {loader}
