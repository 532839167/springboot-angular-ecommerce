import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from "src/app/common/cart-item";
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // pagination properties
  page: number = 1;
  size: number = 10;
  totalElements: number = 0;

  previousKey: string = null;
  

  constructor(private productService: ProductService, private cartService: CartService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {

    // if the route has the parameter 'keyword' then we are in search mode
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }

  }

  handleListProducts() {
     /**
     *  check if "id" parameter is available
     *  route: the activated route
     *  snapshot: state of route at this given moment in time
     *  paramMap: map of all the route parameters
     */
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the id param string and convert it to number using "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    } else {
      // default value
      this.currentCategoryId = 1;
    }

    // Check if we have a different category than previous
    // Note: Angular will reuse a component if it is currently being viewed

    // if we have a different category id then set page back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.page = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, page=${this.page}`);

    // get the product for the given category id
    this.productService.getProductListPaginate(this.page - 1, this.size, this.currentCategoryId).subscribe(this.processResult())
  }

  processResult() {
    // map data from json responde to the actual properties
    return data => {
      this.products = data._embedded.products;
      this.page = data.page.number + 1; // Angular is 1 based, spring data is 0 based
      this.size = data.page.size;
      this.totalElements = data.page.totalElements;
    }
  }

  handleSearchProducts() {
    const key : string = this.route.snapshot.paramMap.get('keyword');

    // if we have a different keyword, set page to 1
    if(this.previousKey != key) {
      this.page = 1;
    }

    this.previousKey = key;

    console.log(`keyword=%{key}`)

    this.productService.searchProductsPaginate(this.page - 1, this.size, key).subscribe(this.processResult());
  }

  addToCart(p: Product) {
    console.log(`Adding to cart: ${p.name}, ${p.unitPrice}`);

    const theCartItem = new CartItem(p);

    this.cartService.addToCart(theCartItem);
  }

}
