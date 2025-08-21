import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export interface PortfolioItem {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: Date;
  transactionType: 'buy' | 'sell';
}

export interface Transaction {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  quantity: number;
  price: number;
  date: Date;
  type: 'buy' | 'sell';
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private readonly STORAGE_KEY = 'crypto-portfolio';
  private readonly TRANSACTIONS_KEY = 'crypto-transactions';
  
  private portfolioSubject = new BehaviorSubject<PortfolioItem[]>([]);
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  
  public portfolio$ = this.portfolioSubject.asObservable();
  public transactions$ = this.transactionsSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadPortfolio();
    this.loadTransactions();
  }

  private isClient(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private loadPortfolio(): void {
    if (!this.isClient()) {
      return; // Skip localStorage operations on server
    }
    
    const storedPortfolio = localStorage.getItem(this.STORAGE_KEY);
    if (storedPortfolio) {
      try {
        const portfolio: PortfolioItem[] = JSON.parse(storedPortfolio);
        // Convert date strings back to Date objects
        portfolio.forEach(item => {
          item.purchaseDate = new Date(item.purchaseDate);
        });
        this.portfolioSubject.next(portfolio);
      } catch (error) {
        console.error('Error loading portfolio from localStorage:', error);
        this.portfolioSubject.next([]);
      }
    }
  }

  private loadTransactions(): void {
    if (!this.isClient()) {
      return; // Skip localStorage operations on server
    }
    
    const storedTransactions = localStorage.getItem(this.TRANSACTIONS_KEY);
    if (storedTransactions) {
      try {
        const transactions: Transaction[] = JSON.parse(storedTransactions);
        // Convert date strings back to Date objects
        transactions.forEach(transaction => {
          transaction.date = new Date(transaction.date);
        });
        this.transactionsSubject.next(transactions);
      } catch (error) {
        console.error('Error loading transactions from localStorage:', error);
        this.transactionsSubject.next([]);
      }
    }
  }

  private savePortfolio(): void {
    if (!this.isClient()) {
      return; // Skip localStorage operations on server
    }
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.portfolioSubject.value));
    } catch (error) {
      console.error('Error saving portfolio to localStorage:', error);
    }
  }

  private saveTransactions(): void {
    if (!this.isClient()) {
      return; // Skip localStorage operations on server
    }
    
    try {
      localStorage.setItem(this.TRANSACTIONS_KEY, JSON.stringify(this.transactionsSubject.value));
    } catch (error) {
      console.error('Error saving transactions to localStorage:', error);
    }
  }

  buyCoin(
    coinId: string, 
    coinName: string, 
    coinSymbol: string, 
    coinImage: string,
    quantity: number, 
    price: number
  ): void {
    const portfolio = [...this.portfolioSubject.value];
    const existingItem = portfolio.find(item => item.coinId === coinId);
    
    // Create transaction record
    const transaction: Transaction = {
      id: this.generateId(),
      coinId,
      coinName,
      coinSymbol,
      coinImage,
      quantity,
      price,
      date: new Date(),
      type: 'buy',
      total: quantity * price
    };

    if (existingItem) {
      // Update existing portfolio item (average price calculation)
      const totalValue = (existingItem.quantity * existingItem.purchasePrice) + (quantity * price);
      const totalQuantity = existingItem.quantity + quantity;
      
      existingItem.quantity = totalQuantity;
      existingItem.purchasePrice = totalValue / totalQuantity;
      existingItem.currentPrice = price;
    } else {
      // Add new portfolio item
      const newItem: PortfolioItem = {
        id: this.generateId(),
        coinId,
        coinName,
        coinSymbol,
        coinImage,
        quantity,
        purchasePrice: price,
        currentPrice: price,
        purchaseDate: new Date(),
        transactionType: 'buy'
      };
      portfolio.push(newItem);
    }

    // Add transaction to history
    const transactions = [...this.transactionsSubject.value];
    transactions.unshift(transaction); // Add to beginning for chronological order

    this.portfolioSubject.next(portfolio);
    this.transactionsSubject.next(transactions);
    this.savePortfolio();
    this.saveTransactions();
  }

  sellCoin(
    coinId: string,
    coinName: string,
    coinSymbol: string,
    coinImage: string,
    quantity: number,
    price: number
  ): boolean {
    const portfolio = [...this.portfolioSubject.value];
    const existingItem = portfolio.find(item => item.coinId === coinId);
    
    if (!existingItem || existingItem.quantity < quantity) {
      return false; // Not enough coins to sell
    }

    // Create transaction record
    const transaction: Transaction = {
      id: this.generateId(),
      coinId,
      coinName,
      coinSymbol,
      coinImage,
      quantity,
      price,
      date: new Date(),
      type: 'sell',
      total: quantity * price
    };

    // Update portfolio item
    existingItem.quantity -= quantity;
    existingItem.currentPrice = price;

    // Remove item if quantity reaches zero
    if (existingItem.quantity <= 0) {
      const index = portfolio.findIndex(item => item.id === existingItem.id);
      if (index > -1) {
        portfolio.splice(index, 1);
      }
    }

    // Add transaction to history
    const transactions = [...this.transactionsSubject.value];
    transactions.unshift(transaction); // Add to beginning for chronological order

    this.portfolioSubject.next(portfolio);
    this.transactionsSubject.next(transactions);
    this.savePortfolio();
    this.saveTransactions();
    
    return true;
  }

  updateCurrentPrices(priceUpdates: { [coinId: string]: number }): void {
    const portfolio = [...this.portfolioSubject.value];
    let updated = false;

    portfolio.forEach(item => {
      if (priceUpdates[item.coinId] !== undefined) {
        item.currentPrice = priceUpdates[item.coinId];
        updated = true;
      }
    });

    if (updated) {
      this.portfolioSubject.next(portfolio);
      this.savePortfolio();
    }
  }

  getPortfolioValue(): number {
    return this.portfolioSubject.value.reduce((total, item) => {
      return total + (item.quantity * item.currentPrice);
    }, 0);
  }

  getPortfolioProfitLoss(): number {
    return this.portfolioSubject.value.reduce((total, item) => {
      const purchaseValue = item.quantity * item.purchasePrice;
      const currentValue = item.quantity * item.currentPrice;
      return total + (currentValue - purchaseValue);
    }, 0);
  }

  getCoinHolding(coinId: string): PortfolioItem | undefined {
    return this.portfolioSubject.value.find(item => item.coinId === coinId);
  }

  clearPortfolio(): void {
    this.portfolioSubject.next([]);
    this.transactionsSubject.next([]);
    
    if (this.isClient()) {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.TRANSACTIONS_KEY);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
