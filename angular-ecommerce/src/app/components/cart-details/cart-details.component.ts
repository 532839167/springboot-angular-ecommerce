import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];

  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) {
    
  }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {

    this.cartItems = this.cartService.cartItems;
    
    // subscribe
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    // calculate total price and quantity
    this.cartService.calculateTotals();

  }

  increaseQuantity(item: CartItem) {
    this.cartService.addToCart(item);
  }

  decreaseQuantity(item: CartItem) {
    this.cartService.decreaseQuantity(item);
  }

  remove(item: CartItem) {
    this.cartService.remove(item);
  }

}
