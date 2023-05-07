

export class UserLogin {
    email: string;
    password: string;
}
export class UserSingUp {
    email: string;
    password: string;
    full_name: string;
    age: number;
    avatar: string | null
}

export class UpdateUser {
    email: string;
    password: string;
    full_name: string;
    age: number;
}

export class SaveImageDto {
    user_id: number;
    image_id: number
}
