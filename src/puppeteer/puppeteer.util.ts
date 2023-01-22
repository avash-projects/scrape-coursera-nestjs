export const getUrl = (category: string) => {
    const input = category.replace(" ", "%20")
    const url = `https://www.coursera.org/search?query=${input}`
    return url
}