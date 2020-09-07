import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();

  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(item: CartItem) {

    // check if already exist
    let alreadyExist: boolean = false;
    let existingItem: CartItem = undefined;

    if (this.cartItems.length > 0) {
      // find the item in the cart
      // for (let temp of this.cartItems) {
      //   if (temp.id == item.id) {
      //     existingItem = temp;
      //     break;
      //   }
      // }
      existingItem = this.cartItems.find( tempItem => tempItem.id == item.id);
      alreadyExist = (existingItem != undefined);
    }

    alreadyExist = (existingItem != undefined);

    if (alreadyExist) {
      // increase quantity
      existingItem.quantity ++;
    } else {
      this.cartItems.push(item);
    }

    // calculate cart totals
    this.calculateTotals();

  }

  calculateTotals() {
    
    let cartPrice: number = 0;
    let cartQuantity: number = 0;

    for(let temp of this.cartItems) {
      cartPrice += temp.quantity * temp.unitPrice;
      cartQuantity += temp.quantity;
    }

    // publish the new values
    this.totalPrice.next(cartPrice);
    this.totalQuantity.next(cartQuantity);

    this.logCartData(cartPrice, cartQuantity)
  }

  logCartData(cartPrice: number, cartQuantity: number) {
    console.log('Contents of the cart');
    for (let temp of this.cartItems) {
      const subtotalPrice = temp.quantity * temp.unitPrice;
      console.log(`name: ${temp.name}, quantity=${temp.quantity}, unitPrice=${temp.unitPrice}`);
    }

    console.log(`totalPrice: ${cartPrice.toFixed(2)}`);
  }

  decreaseQuantity(item: CartItem) {
    item.quantity--;

    if(item.quantity == 0) {
      this.remove(item);
    } else {
      this.calculateTotals();
    }
  }
  remove(item: CartItem) {
    
    // get index of item in the array
    const itemIndex = this.cartItems.findIndex( temp => temp.id === item.id );

    // if found, remove the item from the array
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);

      this.calculateTotals();
    }

  }

}
