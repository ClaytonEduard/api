
export interface ICreate {
    name: string;
    email: string;
    password: string;
}

export interface IUpdate {
    name: string;
    oldPassword: string;
    newPassword: string;
    avatar_url?: FileUpload;// ? siginifica que é opcional
    user_id: string;
}

interface FileUpload {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}