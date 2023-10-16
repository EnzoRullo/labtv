import { movieDetailResponse } from "./movie-model";
import { tvDetailResponse } from "./tv-model";

export class RegisterDto {
    username: string;
    email: string;
    password: string;

    constructor(n: string = "", e: string = "", p: string = "") {
        this.username = n;
        this.email = e;
        this.password = p;

    }
}

export class LoginDto {
    email: string;
    password: string;

    constructor(e: string = "", p: string = "", n: string = "") {
        this.email = e;
        this.password = p;
    }
}

export interface LoggedUser {
    user: User;
    accessToken: string;
}

export interface User {
    email: string;
    id: number;
    username: string;
}

export class Purchase {
    userId: number;
    mediaType: string
    mediaItem: movieDetailResponse | tvDetailResponse

    constructor(u: number, mt:string, media: movieDetailResponse | tvDetailResponse) {
        this.userId = u;
        this.mediaType = mt;
        this.mediaItem = media;
    }
}

