import { Injectable } from '@nestjs/common';
import { BookDto } from './interface/Book.dto';
import { readFile } from 'fs';

@Injectable()
export class BookService {
    private books: BookDto[] =[];


    init(){
        readFile('./dataset.json', 'utf8', (error, data) => {
            if(error){
            console.log(error);
            return;
            }
            this.books = JSON.parse(data);
        })
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
