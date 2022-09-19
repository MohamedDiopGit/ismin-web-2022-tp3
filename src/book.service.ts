import { Injectable, OnModuleInit } from '@nestjs/common';
import { BookDto } from './interface/Book.dto';
import { readFile } from 'fs/promises';

@Injectable()
export class BookService implements OnModuleInit {
    private books: BookDto[] =[];


    async onModuleInit() {
        try{
            let data = await readFile('./src/dataset.json');  
            this.books = JSON.parse(data.toString());  
        }
        catch (err) {
            console.log(err)
        }
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
