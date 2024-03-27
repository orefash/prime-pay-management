

export interface ConfirmEmail {
    name: string;
    token?: string;
    redirect_url: string;
    email: string;
}