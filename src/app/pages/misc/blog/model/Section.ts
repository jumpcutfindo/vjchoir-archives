export interface Section {
    header?: string,
    image_front?: {
        src: string,
        caption?: string
    },
    content: string,
    image_back?: {
        src: string,
        caption?: string
    }
}