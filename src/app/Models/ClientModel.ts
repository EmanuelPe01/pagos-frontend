import { Product } from "./ProductModel"

export interface Client {
    id:     number,
    name: string
}

export interface Clientes{
    clientes:   Client[]
}

export interface PaymentClient {
    cliente:       Client,
    pendientes:    Product[],
    pagados:       Product[]
}

