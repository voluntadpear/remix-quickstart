const hasErrors = (errors: Record<string, boolean>) => {
    return Object.entries(errors).some(([, value]) => value)
}

export {hasErrors}
