import { Section } from './Section';

export interface Post {
    title: string,
    date: string,
    author: string,
    sections: Section[]
}