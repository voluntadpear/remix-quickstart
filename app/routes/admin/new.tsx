import {Form, useActionData, useTransition, redirect} from "remix"
import type {ActionFunction} from "remix"
import {createPost} from "~/post"
import invariant from "tiny-invariant"
import {hasErrors} from "~/utils/errors"

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
    await createPost({title, slug, markdown})

    return redirect("/admin")
}

const NewPost = () => {
    const errors = useActionData()
    const transition = useTransition()

    return (
        <Form method="post">
            <p>
                <label>
                    Post Title: {errors?.title && <em>Title is required</em>}
                    <input type="text" name="title" />
                </label>
            </p>

            <p>
                <label>
                    Post Slug: {errors?.slug && <em>Slug is required</em>}
                    <input type="text" name="slug" />
                </label>
            </p>

            <p>
                <label htmlFor="markdown">Markdown:</label>{" "}
                {errors?.markdown && <em>Markdown is required</em>}
                <br />
                <textarea rows={20} name="markdown" />
            </p>

            <p>
                <button type="submit">
                    {transition.submission ? "Creating..." : "Create Post"}
                </button>
            </p>
        </Form>
    )
}

export default NewPost
export {action}
