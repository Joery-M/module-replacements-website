export interface GithubMarkdownFile {
    meta: {
        url: string;
    };
    file: {
        contents: string;
        html: string;
    };
}

export interface GithubJsonFile {
    meta: {
        url: string;
    };
    file: {
        contents: string;
    };
}
