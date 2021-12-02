import path from "path"
import fs from "fs/promises"
import parseFrontMatter from "front-matter"
import invariant from "tiny-invariant"
import {marked} from "marked"

type Post = {
    slug: string
    title: string
    markdown: string
    html: string
}

type PostFrontmatter = Pick<Post, "title">
type Posts = Pick<Post, "slug" | "title">[]
type NewPost = Pick<Post, "slug" | "title" | "markdown">

const isValidPostFrontmatter = (
    attributes: any,
): attributes is PostFrontmatter => {
    return attributes?.title
}

const postsPath = path.join(__dirname, "..", "posts")

const getPost = async (slug: string): Promise<Post> => {
    const filepath = path.join(postsPath, slug + ".md")
    const file = await fs.readFile(filepath)
    const {attributes, body} = parseFrontMatter(file.toString())

    invariant(
        isValidPostFrontmatter(attributes),
        `Post ${filepath} is missing attributes`,
    )

    const html = marked(body)

    const post: Post = {
        slug,
        title: attributes.title,
        markdown: body,
        html,
    }

    return post
}

const getPosts = async (): Promise<Posts> => {
    const dir = await fs.readdir(postsPath)

    return Promise.all(
        dir.map(async filename => {
            const file = await fs.readFile(path.join(postsPath, filename))
            const {attributes} = parseFrontMatter(file.toString())

            invariant(
                isValidPostFrontmatter(attributes),
                `${filename} has bad meta data!`,
            )

            return {
                slug: filename.replace(/\.md$/, ""),
                title: attributes.title,
            }
        }),
    )
}

const createPost = async (post: NewPost) => {
    let markdown = `---\ntitle: ${post.title}\n---\n\n${post.markdown}`
    await fs.writeFile(path.join(postsPath, post.slug + ".md"), markdown)
    return getPost(post.slug)
}

const editPost = async (post: NewPost) => {
    let markdown = `---\ntitle: ${post.title}\n---\n\n${post.markdown}`
    await fs.writeFile(path.join(postsPath, post.slug + ".md"), markdown)
    return getPost(post.slug)
}

export {getPost, getPosts, createPost, editPost}
export type {Post, Posts}
