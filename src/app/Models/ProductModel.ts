export interface Product {
    id:         number,
    name:       string,
    price:      number,
    created_at: string
}

export interface Products {
    productos:  Product[]
}