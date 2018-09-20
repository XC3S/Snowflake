import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import Amplify, { API, graphqlOperation } from "aws-amplify";

const ListBlogs = `query ListBlogs {
  listBlogs(limit:10){
    items {
      id
      name
      posts {
        items {
          title
          comments {
            items {
              content
            }
          }
        }
      }
    }
  }
}`;

const CreateBlog = `mutation CreateBlog($name: String!) {
  createBlog(input:{name: $name}){
    id
  }
}`;

const DeleteBlog = `mutation DeleteBlog($id: ID!) {
  deleteBlog(input:{id: $id}){
    id
  }
}`;

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})

export class BlogsComponent implements OnInit {

  constructor() { }

  blogs = [];

  allBlogs;

  ngOnInit() {
    this.refreshBlogs();
  }

  refreshBlogs(){
    this.allBlogs = API.graphql(graphqlOperation(ListBlogs));
    this.allBlogs.then(varr => {
      console.log("x",varr.data.listBlogs.items);
      this.blogs = varr.data.listBlogs.items;
    });
  }

  submitBlog(blogForm:NgForm) {
    console.log(blogForm.value);  // { first: '', last: '' }
    console.log(blogForm.valid);  // false

    if(blogForm.valid){
      let request:any = API.graphql(graphqlOperation(CreateBlog, { name: blogForm.value.blogName }));
      request.then(result => {
        console.log("created: ",result);
        this.refreshBlogs();
      })
    }
  }

  deleteBlog(blogId:String) {
    console.log("delete ",blogId);

    let request:any = API.graphql(graphqlOperation(DeleteBlog, {id: blogId}));

    //optimistic update
    //this.allBlogs.items.


    request.then(result => {
      console.log("deleted: ",result);
      this.refreshBlogs();
    })
  }
}

