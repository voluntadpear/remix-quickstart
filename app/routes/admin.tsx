import {Link, useLoaderData, Outlet} from "remix"
import {getPosts} from "~/post"
import type {Post} from "~/post"
import adminStyles from "~/styles/admin.css"

const links = () => {
    return [{rel: "stylesheet", href: adminStyles}]
}

const loader = () => {
    return getPosts()
}

const Admin = () => {
    const posts = useLoaderData<Post[]>()

    return (
        <div className="admin">
            <nav>
                <h1>Admin</h1>

                <ul>
                    {posts.map(post => (
                        <li key={post.slug}>
                            <Link to={post.slug}>{post.title}</Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default Admin
export {loader, links}
