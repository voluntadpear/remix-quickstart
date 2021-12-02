import {
    Form,
    redirect,
    useActionData,
    useLoaderData,
    useTransition,
} from "remix"
import type {ActionFunction, LoaderFunction} from "remix"
import {hasErrors} from "~/utils/errors"
import invariant from "tiny-invariant"
import {editPost, getPost} from "~/post"
import type {Post} from "~/post"

const loader: LoaderFunction = async ({params}) => {
    invariant(params.slug, "expected params.slug")
    return getPost(params.slug)
}

const action: ActionFunction = async ({request}) => {
    const formData = await request.formData()

    const title = formData.get("title")
    const slug = formData.get("slug")
    const markdown = formData.get("markdown")

    const errors = {title: false, slug: false, markdown: false}

    if (!title) {
        errors.title = true
    }

    if (!slug) {
        errors.slug = true
    }

    if (!markdown) {
        errors.markdown = true
    }

    if (hasErrors(errors)) {
        return errors
    }

    invariant(typeof title === "string")
    invariant(typeof slug === "string")
    invariant(typeof markdown === "string")

    await new Promise(res => setTimeout(res, 1000))
    await editPost({title, slug, markdown})

    return redirect("/admin")
}

const EditPost = () => {
    const post = useLoaderData<Post>()
    const errors = useActionData()
    const transition = useTransition()

    return (
        <Form key={post.slug} method="post">
            <p>
                <label>
                    Post Title: {errors?.title && <em>Title is required</em>}
                    <input type="text" name="title" defaultValue={post.title} />
                </label>
            </p>

            <p>
                <label>
                    Post Slug: {errors?.slug && <em>Slug is required</em>}
                    <input type="text" name="slug" defaultValue={post.slug} />
                </label>
            </p>

            <p>
                <label htmlFor="markdown">Markdown:</label>{" "}
                {errors?.markdown && <em>Markdown is required</em>}
                <br />
                <textarea
                    rows={20}
                    name="markdown"
                    defaultValue={post.markdown}
                />
            </p>

            <p>
                <button type="submit">
                    {transition.submission ? "Updating..." : "Update Post"}
                </button>
            </p>
        </Form>
    )
}

export default EditPost
export {action, loader}
