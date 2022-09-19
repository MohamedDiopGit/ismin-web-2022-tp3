import { Injectable, OnModuleInit } from '@nestjs/common';
import { BookDto } from './interface/Book.dto';
import { readFile } from 'fs/promises';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { tap, map, Observable } from 'rxjs';
import { ApiBook } from './interface/ApiBook.dto';

@Injectable()
export class BookService implements OnModuleInit {
    private books: BookDto[] =[];

    constructor(private readonly httpService: HttpService) {}

    async onModuleInit() : Promise<void>{
        // try{
        //     let data = await readFile('./src/dataset.json');  
        //     this.books = JSON.parse(data.toString());  
        // }
        // catch (err) {
        //     console.log('Err: $(err)');
        // }

        try{

            const data = await readFile('./src/dataset.json');
            this.books = JSON.parse(data.toString());
            const dataApi = this.httpService.get<ApiBook[]>('https://api.npoint.io/40518b0773c787f94072');

            const dataConverted = dataApi.pipe(
                map( (response) => {return response.data}),
                tap( (apibooks) => { 
                    apibooks.forEach( (e) => {
                        return this.books.push(
                            {
                                title: e.title,
                                author : e.authors, 
                                date : e.publication_date.toString()
                            }
                        )}
                    )}
                ) 
            
            ).subscribe()
              
            
        }
        catch (err) {
            console.log('Err: $(err)');
        }
        console.log(this.books);
    }

    addBook(book: BookDto){
        if(!this.books.find((value) => value.title === book.title)){ 
            this.books.push(book); 
        }
        return book;
    }
    getAllBooks() : BookDto[]
    {
        return this.books.sort((a,b)=>{
            return a.title.localeCompare(b.title);
        })

    }

    getBook(name: string){
        const book = this.books.find((value) => value.title === name);
        if(!book){
            throw new Error(`BookDto not found: ${name}`);
        } 
        return book;
    }

    getBooksOf(author: string) : BookDto[]{
        return this.books.filter((value) => value.author === author);    // return all books of the author
    }


    deleteBook(title: string){
        for( var i = 0; i < this.books.length; i++){ 
    
            if ( this.books[i].title === title ) { 
        
                this.books.splice(i, 1); 
            }
        
        }
    }
}
