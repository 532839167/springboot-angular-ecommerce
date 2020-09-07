import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product: Product = new Product();

  constructor(private productService : ProductService, private cartService: CartService, private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getProductDetails();
    })
  }

  getProductDetails() {
    
    // get 'id' and convert to number
    const pid : number = +this.route.snapshot.paramMap.get('id');

    this.productService.getProduct(pid).subscribe(
      data => {
        this.product = data;
      }
    )

  }

  addToCart() {
      console.log(`Adding to cart: ${this.product.name}, ${this.product.unitPrice}`);
      const item = new CartItem(this.product);
      this.cartService.addToCart(item);
  }

}
