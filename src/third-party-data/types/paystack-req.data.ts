

export interface TransferRecipient {
    status: boolean;
    recipient_code?: string;
}


export interface WithdrawResponse {
    status: boolean;
    withdraw_status?: string;
}