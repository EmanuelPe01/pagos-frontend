export interface Payment {
    id:         number,
    mount:      number,
    created_at: string
}

export interface PaymentRegister {
    mount:      number,
    id_compra:  number
}

export interface Payments{
    mount:      number,
    pagos:      Payment[],
}