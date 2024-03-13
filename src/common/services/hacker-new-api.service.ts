import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Item, User } from '../interfaces/hacker-news.interface';

@Injectable()
export class HackerNewsAPIService {
  private readonly baseUrl = 'https://hacker-news.firebaseio.com/v0';

  constructor(private readonly httpService: HttpService) {}

  // Fetch top stories from Hacker News API
  async fetchTopStories(): Promise<AxiosResponse<Item[], any>> {
    const url = `${this.baseUrl}/topstories.json`;
    return await lastValueFrom(this.httpService.get(url));
  }

  // Fetch item details (story, comment, etc.) from Hacker News API
  async fetchItem(id: number): Promise<AxiosResponse<Item, any>> {
    const url = `${this.baseUrl}/item/${id}.json`;
    return await lastValueFrom(this.httpService.get(url));
  }

  // Fetch user details (author) from Hacker News API
  async fetchUser(username: string): Promise<AxiosResponse<User, any>> {
    const url = `${this.baseUrl}/user/${username}.json`;
    return await lastValueFrom(this.httpService.get(url));
  }
}
