import { Injectable } from '@angular/core';
import blogJSON from '../../../../assets/data/blog.json';
import { Observable, of } from 'rxjs';
import { Post } from './model/Post';

@Injectable({
    providedIn: "root"
})

export class BlogService {
    constructor() {}

    getBlogInfo(): Observable<any> {
        let postArray: Post[] = [];

        for(let post of blogJSON.posts) {
            postArray.push(post);
        }
        
        let info = {
            intro: blogJSON.intro,
            posts: postArray
        }
        
        return of(blogJSON);
    }
}