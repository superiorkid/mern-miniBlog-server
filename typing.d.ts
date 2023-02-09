interface IUserAuth  {
    username: string,
    email: string,
    password: string
}

interface IToken {
    id: string,
    exp: number,
    iat: number
}

interface ITag {
    name: string
}