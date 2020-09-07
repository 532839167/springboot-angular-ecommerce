import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';

  constructor(private httpClient: HttpClient) { }

  // Returns an observable
  // map the JSON data from Spring Data REST to Product array
  getProductList(theCategoryId: number): Observable<Product[]> {

    // build url based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    // make a get request to the base url. Pipe the returned data
    return this.httpClient.get<GetResponse>(searchUrl).pipe(map(response => response._embedded.products));
  }

  getProductListPaginate(p: number, size: number, theCategoryId: number): Observable<GetResponse> {

    // build url based on category id, page and size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}` + `&page=${p}&size=${size}`;

    // make a get request to the base url. Pipe the returned data
    return this.httpClient.get<GetResponse>(searchUrl);
  }

  searchProductsPaginate(p: number, size: number, key: string): Observable<GetResponse> {

    // build url based on keyword, page and size
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${key}` + `&page=${p}&size=${size}`;

    // make a get request to the base url. Pipe the returned data
    return this.httpClient.get<GetResponse>(searchUrl);
  }

  searchProducts(key: string): Observable<Product[]> {

        // build url based on keyword
        const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${key}`;

        // make a get request to the base url. Pipe the returned data
        return this.httpClient.get<GetResponse>(searchUrl).pipe(map(response => response._embedded.products));
  }

  getProduct(pid: number): Observable<Product> {
    
    // build url based on product id
    const productUrl = `${this.baseUrl}/${pid}`;

    return this.httpClient.get<Product>(productUrl);

  }
}

interface GetResponse {

  // Unwrap the JSON from Spring Data REST _embedded entry
  _embedded: {
    products: Product[];
  },

  page: {
    size: number,
    totalElement: number,
    totalPages: number,
    number: number
  }
}