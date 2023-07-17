import { Product } from "./ProductModel"

export interface Client {
    id:     number,
    name: string
}

export interface Clientes{
    clientes:   Client[]
}

export interface PaymentClient {
    cliente:    Client,
    compras:    Product[]
}

